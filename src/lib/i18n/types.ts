export type Locale = "pt-BR" | "pt-PT" | "en";

export const LOCALES: Locale[] = ["pt-BR", "pt-PT", "en"];

export const LOCALE_LABEL: Record<Locale, string> = {
  "pt-BR": "PT-BR",
  "pt-PT": "PT-PT",
  en: "EN",
};

export interface Dictionary {
  common: {
    loading: string;
    ok: string;
    cancel: string;
    continue: string;
  };
  header: {
    mute: string;
    sound: string;
    muteAriaOn: string;
    muteAriaOff: string;
    notifOn: string;
    notifOff: string;
    notifAriaOn: string;
    notifAriaOff: string;
    languageLabel: string;
    fullscreen: string;
    fullscreenExit: string;
    fullscreenAria: string;
    fullscreenExitAria: string;
  };
  stats: {
    hunger: string;
    happiness: string;
    energy: string;
    hygiene: string;
    health: string;
  };
  stages: Record<
    "egg" | "baby" | "child" | "teen" | "adult" | "elder",
    string
  >;
  variants: Record<"normal" | "mega" | "dark", string>;
  moodStatus: Record<
    "happy" | "sad" | "sick" | "sleeping" | "hungry" | "dirty",
    string
  >;
  flags: {
    sleeping: string;
    sick: string;
    dirty: string;
  };
  actions: {
    feed: string;
    candy: string;
    play: string;
    sleep: string;
    wake: string;
    bath: string;
    medicine: string;
    clean: string;
    reset: string;
    title: string;
  };
  toasts: {
    fed: string;
    candy: string;
    goodMorning: string;
    goodNight: string;
    clean: string;
    cured: string;
    poopCleaned: string;
    notSick: string;
    nothingToClean: string;
    minigameWon: string;
    minigameLost: string;
    notifEnabled: string;
    notifDenied: string;
    exported: string;
    imported: string;
    importInvalid: string;
    patted: string;
  };
  start: {
    askName: string;
    nameLabel: string;
    speciesLabel: string;
    hatch: string;
    placeholder: string;
  };
  death: {
    rip: string;
    lifeMinutes: string;
    newPet: string;
  };
  minigame: {
    title: string;
    subtitle: string;
    prompt: string;
    won: string;
    lostWas: string;
    continue: string;
  };
  minigameHub: {
    title: string;
    subtitle: string;
    coins: string;
    guessName: string;
    guessDesc: string;
    simonName: string;
    simonDesc: string;
    reflexName: string;
    reflexDesc: string;
    reward: string;
  };
  simon: {
    title: string;
    subtitle: string;
    watch: string;
    yourTurn: string;
    round: string;
    gameOver: string;
    victory: string;
    earned: string;
    start: string;
    exit: string;
  };
  reflex: {
    title: string;
    subtitle: string;
    wait: string;
    now: string;
    tooEarly: string;
    hit: string;
    miss: string;
    round: string;
    finished: string;
    earned: string;
    start: string;
    exit: string;
  };
  reset: {
    title: string;
    subtitle: string;
    cancel: string;
    confirm: string;
  };
  graveyard: {
    title: string;
    subtitle: string;
    empty: string;
  };
  status: {
    title: string;
    achievements: string;
    graveyard: string;
    history: string;
    historySub: string;
    historyEmpty: string;
    daycare: string;
    daycareOn: string;
    daycareOff: string;
    shop: string;
    showcase: string;
    showcaseEmpty: string;
  };
  shop: {
    title: string;
    subtitle: string;
    balance: string;
    slotHat: string;
    slotGlasses: string;
    slotRibbon: string;
    slotButtons: string;
    slotPotions: string;
    potions: Record<
      "potionElixir" | "potionShield" | "potionGrowth" | "potionLuck",
      { name: string; desc: string }
    >;
    use: string;
    used: string;
    needPet: string;
    buy: string;
    own: string;
    equip: string;
    unequip: string;
    insufficient: string;
    bought: string;
    items: Record<
      | "hatCrown"
      | "hatWizard"
      | "hatCap"
      | "glassesRound"
      | "glassesShades"
      | "glassesStar"
      | "ribbonBow"
      | "ribbonCollar"
      | "ribbonTie"
      | "btnCyan"
      | "btnGold"
      | "btnRetro"
      | "btnDark",
      string
    >;
  };
  daycare: {
    title: string;
    subtitle: string;
    enable: string;
    enableDesc: string;
    rulesTitle: string;
    feedLabel: string;
    bathLabel: string;
    cleanLabel: string;
    autoMedicine: string;
    sleepLabel: string;
    wakeLabel: string;
    thresholdSuffix: string;
    close: string;
    reset: string;
  };
  hud: {
    pet: string;
    renameAria: string;
    renameTitle: string;
    renameSave: string;
  };
  achievementsDialog: {
    title: string;
    progress: string;
    unlockedOn: string;
    unlockedBanner: string;
    pin: string;
    unpin: string;
    showcaseFull: string;
    showcasePinned: string;
    showcaseUnpinned: string;
  };
  achievements: {
    firstHatch: { title: string; description: string };
    teenReached: { title: string; description: string };
    adultReached: { title: string; description: string };
    elderReached: { title: string; description: string };
    firstWeek: { title: string; description: string };
    neverSick: { title: string; description: string };
    fullLife: { title: string; description: string };
    petCollector: { title: string; description: string };
    chef: { title: string; description: string };
    sweetTooth: { title: string; description: string };
    bathMaster: { title: string; description: string };
    gamer: { title: string; description: string };
    champion: { title: string; description: string };
    sleepyHead: { title: string; description: string };
    nurse: { title: string; description: string };
    cleanFreak: { title: string; description: string };
    marathon: { title: string; description: string };
    legend: { title: string; description: string };
    megaEvolution: { title: string; description: string };
    darkEvolution: { title: string; description: string };
  };
  causes: {
    healthZero: string;
    abandonment: string;
    oldAge: string;
    unknown: string;
  };
  notifications: {
    hunger: string;
    happy: string;
    hygiene: string;
    health: string;
    sick: string;
    poop: string;
  };
  help: {
    title: string;
    subtitle: string;
    aboutTitle: string;
    aboutIntro: string;
    aboutHistory: string;
    aboutWhy: string;
    shortcutsTitle: string;
    statsTitle: string;
    shortcuts: {
      prev: string;
      next: string;
      select: string;
      direct: string;
      mute: string;
      notif: string;
      language: string;
      help: string;
    };
    statsInfo: {
      hunger: string;
      happiness: string;
      energy: string;
      hygiene: string;
      health: string;
    };
    close: string;
    helpAria: string;
    helpLabel: string;
    dataTitle: string;
    export: string;
    exportDesc: string;
    import: string;
    importDesc: string;
    daycareTitle: string;
    daycareIntro: string;
    daycareHowItWorks: string;
    daycareLimits: string;
  };
}
