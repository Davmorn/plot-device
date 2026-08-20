// Story element categories. Each key is a category; edit/add items freely.
const CATEGORIES = {
  character: {
    label: "Character",
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
      "A clone questioning their own identity",
      "Spider-Man",
      "Batman",
      "Superman",
      "Wonder Woman",
      "Iron Man",
      "Captain America",
      "The Hulk",
      "Wolverine",
      "Black Panther",
      "Harry Potter",
      "Hermione Granger",
      "Frodo Baggins",
      "Aragorn",
      "Luke Skywalker",
      "Princess Leia",
      "Han Solo",
      "Katniss Everdeen",
      "Sherlock Holmes",
      "James Bond",
      "Indiana Jones",
      "Ellen Ripley",
      "Sarah Connor",
      "Neo",
      "John Wick",
      "Jon Snow",
      "Daenerys Targaryen",
      "Rocky Balboa",
      "Elsa",
      "Moana",
      "Mulan",
      "Simba"
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

// Beat sheet prompts for the fine-tune workshop, based on the "Save the Cat!"
// beat sheet (https://savethecat.com/how-to-write-a-novel). Free-text only,
// no randomizer.
const OUTLINE_FIELDS = [
  {
    key: "openingImage",
    label: "Opening Image",
    act: "Act 1 — The Ordinary World",
    placeholder: "0–1%: A snapshot of the hero before transformation. Sets the tone."
  },
  {
    key: "themeStated",
    label: "Theme Stated",
    act: "Act 1 — The Ordinary World",
    placeholder: "5%: Someone poses the question or statement the story is really about."
  },
  {
    key: "setUp",
    label: "Set-Up",
    act: "Act 1 — The Ordinary World",
    placeholder: "1–10%: Establish the hero's ordinary life, flaws, and world."
  },
  {
    key: "catalyst",
    label: "Catalyst",
    act: "Act 1 — The Ordinary World",
    placeholder: "10%: The life-changing event that sets the story in motion."
  },
  {
    key: "debate",
    label: "Debate",
    act: "Act 1 — The Ordinary World",
    placeholder: "10–20%: The hero hesitates. Should they really go on this journey?"
  },
  {
    key: "breakIntoTwo",
    label: "Break into Two",
    act: "Act 2 — The Upside-Down World",
    placeholder: "20%: The no-turning-back decision into a new world or mindset."
  },
  {
    key: "bStory",
    label: "B Story",
    act: "Act 2 — The Upside-Down World",
    placeholder: "22%: A secondary story (love, friendship, mentorship) that carries the theme."
  },
  {
    key: "funAndGames",
    label: "Fun and Games",
    act: "Act 2 — The Upside-Down World",
    placeholder: "20–50%: The 'promise of the premise' — what the trailer would show."
  },
  {
    key: "midpoint",
    label: "Midpoint",
    act: "Act 2 — The Upside-Down World",
    placeholder: "50%: A false victory or false defeat that raises the stakes."
  },
  {
    key: "badGuysCloseIn",
    label: "Bad Guys Close In",
    act: "Act 2 — The Upside-Down World",
    placeholder: "50–75%: External and internal pressure mounts on the hero."
  },
  {
    key: "allIsLost",
    label: "All Is Lost",
    act: "Act 2 — The Upside-Down World",
    placeholder: "75%: The hero's worst fear comes true. Often a 'whiff of death.'"
  },
  {
    key: "darkNightOfTheSoul",
    label: "Dark Night of the Soul",
    act: "Act 2 — The Upside-Down World",
    placeholder: "75–80%: The hero hits bottom and sits with everything they've lost."
  },
  {
    key: "breakIntoThree",
    label: "Break into Three",
    act: "Act 3 — Merged World",
    placeholder: "80%: New information reveals the solution to Act Two's problems."
  },
  {
    key: "finale",
    label: "Finale",
    act: "Act 3 — Merged World",
    placeholder: "80–99%: The climax, where the hero proves their change through action."
  },
  {
    key: "finalImage",
    label: "Final Image",
    act: "Act 3 — Merged World",
    placeholder: "99–100%: A bookend to the Opening Image, showing how far things came."
  }
];
