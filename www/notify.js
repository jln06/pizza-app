/*
 * Notify — one small wrapper around "alert me at step X".
 *
 * - Running as the Android app (Capacitor): uses the native Local
 *   Notifications plugin. These fire even if the app is closed or the
 *   phone is locked, because they're scheduled with the OS, not with a
 *   JS timer.
 * - Running as a plain website in a browser: falls back to the Web
 *   Notifications API. These only fire while the tab stays open (no
 *   service worker in this build), since a browser tab can't schedule
 *   anything once it's closed.
 *
 * Either way the rest of the app just calls Notify.scheduleAll(...) /
 * Notify.cancelAll() and doesn't need to know which path is active.
 */
window.Notify = (function () {
  'use strict';

  function isNative() {
    return !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
  }
  function LN() {
    return window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.LocalNotifications;
  }

  let webTimers = [];
  let permissionAsked = false;

  function clearWebTimers() {
    webTimers.forEach(id => clearTimeout(id));
    webTimers = [];
  }

  async function requestPermission() {
    if (permissionAsked) return;
    permissionAsked = true;
    if (isNative() && LN()) {
      try { await LN().requestPermissions(); } catch (e) {}
      return;
    }
    if ('Notification' in window && Notification.permission === 'default') {
      try { await Notification.requestPermission(); } catch (e) {}
    }
  }

  // rows: [{ts,label,note}, ...] from timelineData(); doneIndexes: indexes already marked done
  async function scheduleAll(rows, doneIndexes) {
    doneIndexes = doneIndexes || [];
    if (isNative() && LN()) {
      try {
        // clear whatever was scheduled before (ids are 1-based row indexes)
        await LN().cancel({ notifications: rows.map((_, i) => ({ id: i + 1 })) });
        const now = Date.now();
        const toSchedule = rows
          .map((r, i) => ({ r, i }))
          .filter(({ r, i }) => !doneIndexes.includes(i) && r.ts > now)
          .map(({ r, i }) => ({
            id: i + 1,
            title: r.label,
            body: r.note,
            schedule: { at: new Date(r.ts) },
            channelId: 'pizza-steps'
          }));
        if (toSchedule.length) await LN().schedule({ notifications: toSchedule });
      } catch (e) {}
      return;
    }
    // web fallback: foreground-only, plain setTimeout
    clearWebTimers();
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    const now = Date.now(), MAXD = 2147000000; // setTimeout's practical max delay
    rows.forEach((r, i) => {
      if (doneIndexes.includes(i)) return;
      const delay = r.ts - now;
      if (delay > 0 && delay < MAXD) {
        const id = setTimeout(() => { try { new Notification(r.label, { body: r.note }); } catch (e) {} }, delay);
        webTimers.push(id);
      }
    });
  }

  async function cancelAll() {
    if (isNative() && LN()) {
      try {
        const pending = await LN().getPending();
        const list = (pending && pending.notifications) || [];
        if (list.length) await LN().cancel({ notifications: list.map(n => ({ id: n.id })) });
      } catch (e) {}
      return;
    }
    clearWebTimers();
  }

  function statusText() {
    if (isNative()) {
      return "Une alerte se déclenchera à l'heure de chaque étape, même appli fermée ou téléphone verrouillé.";
    }
    if (!('Notification' in window)) return "Les notifications ne sont pas prises en charge par ce navigateur.";
    if (Notification.permission === 'granted') return "Une alerte se déclenchera à l'heure de chaque étape tant que cet onglet reste ouvert.";
    if (Notification.permission === 'denied') return "Notifications refusées par le navigateur — active-les dans les réglages du site si tu les veux.";
    return "Autorise les notifications quand le navigateur te le demande pour recevoir une alerte à chaque étape (l'onglet doit rester ouvert).";
  }

  // On native, set up the Android notification channel once at startup
  // (required on Android 8+ for notifications to show at all).
  if (isNative() && LN() && LN().createChannel) {
    LN().createChannel({
      id: 'pizza-steps',
      name: 'Étapes de la session pizza',
      description: 'Une alerte à chaque étape du protocole',
      importance: 4, // HIGH
      visibility: 1
    }).catch(() => {});
  }

  return { isNative, requestPermission, scheduleAll, cancelAll, statusText };
})();
