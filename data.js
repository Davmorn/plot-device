// Story element categories. Each key is a category; edit/add items freely.
const CATEGORIES = {
  protagonist: {
    label: "Protagonist",
    items: [
      "A retired superhero who's lost their powers",
      "A small-town librarian with a hidden past",
      "An AI that just became self-aware",
      "A washed-up detective on their last case",
      "A teenager who can talk to ghosts",
      "A con artist trying to go straight",
      "An immortal who's forgotten why they wanted to live forever",
      "A soldier who refuses to fight anymore",
      "A chef who can taste memories in food",
      "A courier who delivers messages between worlds",
      "A scientist whose experiment became sentient",
      "A grieving parent searching for answers",
      "A thief who only steals from the wealthy",
      "A child prodigy burned out by expectations",
      "A lighthouse keeper who sees things in the fog",
      "A former villain seeking redemption",
      "A time traveler stuck in the wrong era",
      "A ship captain who's never lost a crew member",
      "A hermit dragged back into society",
      "A clone questioning their own identity"
    ]
  },
  setting: {
    label: "Setting",
    items: [
      "A city that rearranges itself every night",
      "The last library on Earth",
      "A generation ship nearing its destination",
      "A small coastal town where the tide never goes out",
      "The border between two warring kingdoms",
      "A university for retired gods",
      "An underground railway that runs through time",
      "A never-ending story that traps its readers",
      "A floating market above the clouds",
      "A post-apocalyptic greenhouse city",
      "A carnival that only appears once a decade",
      "The inside of a dying star",
      "A village where everyone shares one dream",
      "A courtroom that judges fictional characters",
      "An archive of forgotten memories",
      "A desert where sound turns solid",
      "A hotel that exists between dimensions",
      "A subway system with no exits",
      "A frozen ocean hiding a sunken civilization",
      "A theater where the plays predict the future"
    ]
  },
  conflict: {
    label: "Conflict",
    items: [
      "They must choose between saving one person or many",
      "Their greatest strength has become a liability",
      "They're being hunted by someone who was once family",
      "A promise they made is now impossible to keep",
      "They discover the villain was right all along",
      "Time is running out before an irreversible event",
      "They must trust the one person who betrayed them",
      "Their identity is not what they always believed",
      "Two loyalties are pulling them in opposite directions",
      "The only way forward requires giving up their power",
      "They caused the disaster they're now trying to stop",
      "Someone they love is the source of the threat",
      "The truth would destroy everything they've built",
      "They must undo their life's greatest achievement",
      "A rival needs their help to survive",
      "The rules of their world have suddenly changed",
      "They're trapped reliving the same mistake",
      "Victory requires becoming what they hate most",
      "The map/plan/guide they trusted was wrong",
      "They must convince others of a truth no one wants to hear"
    ]
  },
  twist: {
    label: "Twist",
    items: [
      "The narrator has been lying the whole time",
      "The mentor was the real threat",
      "It was all a simulation/dream/story within a story",
      "The 'villain' was trying to prevent something worse",
      "Two characters are actually the same person",
      "The quest was designed to fail from the start",
      "The protagonist is already dead",
      "Time has been looping without anyone noticing",
      "The map led exactly where it was supposed to",
      "The 'chosen one' prophecy was fabricated",
      "Everyone else can see something the protagonist can't",
      "The sidekick has been the one in control all along",
      "The world isn't as isolated as everyone believed",
      "The cure is worse than the disease",
      "Their memories were altered to hide the truth",
      "The enemy and the ally switch roles",
      "What seemed like magic is actually technology (or vice versa)",
      "The ending was the beginning all along"
    ]
  },
  tone: {
    label: "Tone",
    items: [
      "Whimsical and lighthearted",
      "Bleak and unforgiving",
      "Tense, thriller-paced",
      "Melancholic and reflective",
      "Absurdist and comedic",
      "Cozy and slow-burning",
      "Eerie and unsettling",
      "Epic and larger-than-life",
      "Quiet and intimate",
      "Satirical and biting",
      "Hopeful despite the odds",
      "Noir and cynical",
      "Dreamlike and surreal"
    ]
  },
  genre: {
    label: "Genre",
    items: [
      "Science fiction",
      "High fantasy",
      "Urban fantasy",
      "Mystery/detective",
      "Horror",
      "Romance",
      "Historical fiction",
      "Cyberpunk",
      "Fairy tale retelling",
      "Post-apocalyptic",
      "Space opera",
      "Magical realism",
      "Steampunk",
      "Superhero",
      "Slice of life"
    ]
  },
  antagonist: {
    label: "Antagonist",
    items: [
      "A bureaucrat enforcing an unjust law",
      "A former ally who now sees things differently",
      "A force of nature given a will of its own",
      "An idealist willing to do anything for their cause",
      "A version of the protagonist from another timeline",
      "A corporation that owns the concept of memory",
      "A god who wants to be forgotten",
      "An AI optimizing for the 'wrong' outcome",
      "A parent who won't let go",
      "A cult that believes the end is a gift",
      "A rival who is simply better, most of the time",
      "Society itself, and its quiet cruelties",
      "A monster that used to be human",
      "A judge who is never wrong, and never merciful"
    ]
  },
  keyObject: {
    label: "Key Object",
    items: [
      "A map that only shows where you've already been",
      "A letter that was never meant to be delivered",
      "A pocket watch that runs backward",
      "A book that writes itself",
      "A key with no matching lock (yet)",
      "A mirror that shows who you could become",
      "A seed that grows memories instead of plants",
      "An instrument that plays other people's emotions",
      "A coin that always lands on the outcome you fear",
      "A cloak that makes you forgettable, not invisible",
      "A recipe passed down with a hidden meaning",
      "A photograph of a place that no longer exists"
    ]
  },
  secondaryCharacter: {
    label: "Secondary Character",
    items: [
      "A child who knows more than they let on",
      "An estranged sibling seeking reconciliation",
      "A rival turned reluctant ally",
      "A mentor hiding a terminal secret",
      "A stranger who shows up at the worst/best moment",
      "An animal companion who understands more than expected",
      "A bureaucrat quietly helping from the shadows",
      "An old flame with unfinished business",
      "A ghost who won't move on until a debt is settled",
      "A con artist who becomes an unlikely friend"
    ]
  },
  timePeriod: {
    label: "Time Period",
    items: [
      "Ancient/prehistoric",
      "Medieval",
      "Victorian era",
      "1920s",
      "1980s",
      "Present day",
      "Near future (10-30 years)",
      "Far future",
      "An alternate history where a key event went differently",
      "A time period that loops or repeats"
    ]
  }
};

// Outline prompts for the fine-tune workshop. Free-text only, no randomizer.
const OUTLINE_FIELDS = [
  {
    key: "incitingIncident",
    label: "Inciting Incident",
    placeholder: "What event kicks the story into motion?"
  },
  {
    key: "coreConflict",
    label: "Core Conflict",
    placeholder: "What is the central tension driving the story?"
  },
  {
    key: "stakes",
    label: "Stakes",
    placeholder: "What happens if the protagonist fails?"
  },
  {
    key: "turningPoint",
    label: "Turning Point",
    placeholder: "What moment changes the direction of the story?"
  },
  {
    key: "resolution",
    label: "Resolution",
    placeholder: "How does the conflict get resolved (or not)?"
  }
];
