import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Mirrors the base44 entity API shape so no page changes are needed
function makeEntity(tableName) {
  return {
    async list(sortField, limit) {
      let q = supabase.from(tableName).select('*');
      if (sortField) {
        const ascending = !sortField.startsWith('-');
        q = q.order(sortField.replace(/^-/, ''), { ascending });
      }
      if (limit) q = q.limit(limit);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },

    async filter(conditions) {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .match(conditions);
      if (error) throw error;
      return data ?? [];
    },

    async create(record) {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from(tableName)
        .insert({ user_id: user?.id, ...record })
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async update(id, updates) {
      const { data, error } = await supabase
        .from(tableName)
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
  };
}

const auth = {
  async me() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw new Error('Not authenticated');
    const { data: stats } = await supabase
      .from('player_stats')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();
    return {
      id: user.id,
      email: user.email,
      username: stats?.username ?? user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'Player',
      picture: user.user_metadata?.avatar_url ?? null,
      equipped_skin: stats?.equipped_skin ?? 'default',
      total_coins: stats?.total_coins ?? 0,
    };
  },

  async isAuthenticated() {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  },

  async updateMe(updates) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase
      .from('player_stats')
      .upsert({ user_id: user.id, ...updates }, { onConflict: 'user_id' });
    if (error) throw error;
  },

  async logout(redirectUrl) {
    await supabase.auth.signOut();
    window.location.href = redirectUrl ?? '/';
  },

  // No-op: LoginModal now handles auth inline
  redirectToLogin() {},
};

const functions = {
  async invoke(name, params = {}) {
    const { data: { user } } = await supabase.auth.getUser();

    if (name === 'startRun') {
      if (!user) return { data: { success: false } };
      const sessionId = crypto.randomUUID();
      sessionStorage.setItem('run_session', JSON.stringify({
        id: sessionId,
        started_at: new Date().toISOString(),
        user_id: user.id,
        difficulty: params.difficulty,
      }));
      return { data: { success: true, run_session_id: sessionId, started_at: new Date().toISOString() } };
    }

    if (name === 'finishRun') {
      if (!user) return { data: { success: false, reason: 'NOT_AUTHENTICATED' } };
      const { run_session_id, score, coinsCollected, distance, durationMs, difficulty } = params;

      const { error: runErr } = await supabase.from('runs').insert({
        user_id: user.id,
        run_session_id,
        score,
        coins_collected: coinsCollected,
        distance,
        duration_ms: durationMs,
        difficulty,
      });
      if (runErr) return { data: { success: false, reason: runErr.message } };

      const { data: stats } = await supabase
        .from('player_stats')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      const isHighscore = score > (stats?.best_score ?? 0);
      const displayName = stats?.username
        ?? user.user_metadata?.full_name
        ?? user.email?.split('@')[0]
        ?? 'Player';

      const newStats = {
        user_id: user.id,
        username: displayName,
        best_score: Math.max(score, stats?.best_score ?? 0),
        best_distance: Math.max(distance, stats?.best_distance ?? 0),
        total_coins: (stats?.total_coins ?? 0) + coinsCollected,
        total_runs: (stats?.total_runs ?? 0) + 1,
        equipped_skin: stats?.equipped_skin ?? 'default',
      };

      await supabase.from('player_stats')
        .upsert(newStats, { onConflict: 'user_id' });

      if (isHighscore) {
        await supabase.from('leaderboard_entries').upsert({
          user_id: user.id,
          username: displayName,
          score,
          player_avatar: user.user_metadata?.avatar_url ?? null,
        }, { onConflict: 'user_id' });
      }

      sessionStorage.removeItem('run_session');
      return { data: { success: true, isHighscore, stats: newStats } };
    }

    if (name === 'buySkin') {
      if (!user) return { data: { success: false } };
      const { skin_id } = params;

      const { data: existing } = await supabase
        .from('player_skins')
        .select('id')
        .eq('user_id', user.id)
        .eq('skin_id', skin_id)
        .maybeSingle();
      if (existing) return { data: { success: false, reason: 'SKIN_ALREADY_OWNED' } };

      const { data: skin } = await supabase
        .from('skins')
        .select('cost_coins')
        .eq('id', skin_id)
        .single();

      const { data: statsData } = await supabase
        .from('player_stats')
        .select('total_coins')
        .eq('user_id', user.id)
        .maybeSingle();

      if ((statsData?.total_coins ?? 0) < (skin?.cost_coins ?? 0)) {
        return { data: { success: false, reason: 'NOT_ENOUGH_COINS' } };
      }

      await Promise.all([
        supabase.from('player_skins').insert({ user_id: user.id, skin_id }),
        supabase.from('player_stats')
          .update({ total_coins: (statsData.total_coins ?? 0) - (skin.cost_coins ?? 0) })
          .eq('user_id', user.id),
      ]);
      return { data: { success: true } };
    }

    if (name === 'deleteUserData') {
      if (!user) return { data: { success: false } };
      await Promise.all([
        supabase.from('runs').delete().eq('user_id', user.id),
        supabase.from('player_upgrades').delete().eq('user_id', user.id),
        supabase.from('player_skins').delete().eq('user_id', user.id),
        supabase.from('leaderboard_entries').delete().eq('user_id', user.id),
        supabase.from('player_stats').delete().eq('user_id', user.id),
      ]);
      return { data: { success: true } };
    }

    throw new Error(`Unknown function: ${name}`);
  },
};

export const base44 = {
  auth,
  entities: {
    Run: makeEntity('runs'),
    Upgrade: makeEntity('upgrades'),
    PlayerUpgrade: makeEntity('player_upgrades'),
    Skin: makeEntity('skins'),
    PlayerSkin: makeEntity('player_skins'),
    LeaderboardEntry: makeEntity('leaderboard_entries'),
    PlayerStats: makeEntity('player_stats'),
    Mission: makeEntity('missions'),
    PlayerMission: makeEntity('player_missions'),
    PendingRun: makeEntity('pending_runs'),
  },
  functions,
};
