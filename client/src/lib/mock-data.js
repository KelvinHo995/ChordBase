export const mockUsers = [
  {
    id: "user-1",
    username: "johndoe",
    email: "john@example.com",
    password: "password123",
    role: "admin",
    avatar: "/man-avatar.png",
    displayName: "John Doe",
    bio: "Music enthusiast and guitar player",
    joinDate: "2023-01-15",
    locked: false,
  },
  {
    id: "user-2",
    username: "janedoe",
    email: "jane@example.com",
    password: "password123",
    role: "user",
    avatar: "/diverse-woman-avatar.png",
    displayName: "Jane Doe",
    bio: "Singer-songwriter from Nashville",
    joinDate: "2023-03-22",
    locked: false,
  },
  {
    id: "user-3",
    username: "guitarist88",
    email: "guitarist@example.com",
    password: "password123",
    role: "user",
    avatar: "/musician-avatar.png",
    displayName: "Alex Guitar",
    bio: "Professional guitarist",
    joinDate: "2023-06-10",
    locked: false,
  },
  {
    id: "user-4",
    username: "musiclover",
    email: "music@example.com",
    password: "password123",
    role: "user",
    avatar: "/person-avatar-headphones.jpg",
    displayName: "Music Lover",
    bio: "I love all kinds of music",
    joinDate: "2023-08-05",
    locked: true,
  },
]

export const mockSongs = [
  {
    id: "song-1",
    title: "Wonderwall",
    artist: "Oasis",
    genre: "Rock",
    tags: ["90s", "britpop", "acoustic"],
    difficulty: "Beginner",
    rating: 4.8,
    views: 15420,
    uploaderId: "user-1",
    uploaderName: "John Doe",
    status: "published",
    createdAt: "2023-02-10",
    hasValidChords: true,
    chordSheet: `[Intro]
Em7  G  Dsus4  A7sus4 (x2)

[Verse 1]
Em7              G
Today is gonna be the day
         Dsus4              A7sus4
That they're gonna throw it back to you
Em7              G              Dsus4       A7sus4
By now you should've somehow realized what you gotta do
Em7                G
I don't believe that anybody
Dsus4          A7sus4        Em7  G  Dsus4  A7sus4
Feels the way I do about you now

[Chorus]
       C        D              Em7
And all the roads we have to walk are winding
       C        D              Em7
And all the lights that lead us there are blinding
C             D
There are many things that I
        G    D    Em7
Would like to say to you
       A7sus4
But I don't know how

       C    Em7   G    Em7
Because maybe
                C      Em7         G    Em7
You're gonna be the one that saves me
       C    Em7   G    Em7
And after all
                 C    Em7   G
You're my wonderwall`,
  },
  {
    id: "song-2",
    title: "Hotel California",
    artist: "Eagles",
    genre: "Rock",
    tags: ["70s", "classic rock", "iconic"],
    difficulty: "Intermediate",
    rating: 4.9,
    views: 23150,
    uploaderId: "user-2",
    uploaderName: "Jane Doe",
    status: "published",
    createdAt: "2023-03-15",
    hasValidChords: true,
    chordSheet: `[Intro]
Bm  F#7  A  E7  G  D  Em  F#7

[Verse 1]
Bm                              F#7
On a dark desert highway, cool wind in my hair
A                              E7
Warm smell of colitas, rising up through the air
G                              D
Up ahead in the distance, I saw a shimmering light
Em
My head grew heavy and my sight grew dim
F#7
I had to stop for the night

[Verse 2]
Bm                                   F#7
There she stood in the doorway, I heard the mission bell
A                                          E7
And I was thinking to myself, this could be heaven or this could be hell
G                              D
Then she lit up a candle and she showed me the way
Em
There were voices down the corridor
F#7
I thought I heard them say

[Chorus]
G                            D
Welcome to the Hotel California
        F#7                                  Bm
Such a lovely place, such a lovely place, such a lovely face`,
  },
  {
    id: "song-3",
    title: "Shape of You",
    artist: "Ed Sheeran",
    genre: "Pop",
    tags: ["2010s", "hit", "dance"],
    difficulty: "Beginner",
    rating: 4.5,
    views: 18920,
    uploaderId: "user-1",
    uploaderName: "John Doe",
    status: "published",
    createdAt: "2023-04-20",
    hasValidChords: true,
    chordSheet: `[Intro]
C#m  F#m  A  B (x2)

[Verse 1]
C#m                    F#m
The club isn't the best place to find a lover
    A                          B
So the bar is where I go
C#m                    F#m
Me and my friends at the table doing shots
      A                      B
Drinking fast and then we talk slow

[Pre-Chorus]
C#m                    F#m
Come over and start up a conversation with just me
    A                          B
And trust me I'll give it a chance now
C#m                    F#m
Take my hand, stop, put Van the Man on the jukebox
    A                          B
And then we start to dance

[Chorus]
         C#m         F#m
I'm in love with the shape of you
        A              B
We push and pull like a magnet do
         C#m         F#m
Although my heart is falling too
       A                 B
I'm in love with your body`,
  },
  {
    id: "song-4",
    title: "Hallelujah",
    artist: "Leonard Cohen",
    genre: "Folk",
    tags: ["classic", "emotional", "ballad"],
    difficulty: "Intermediate",
    rating: 4.9,
    views: 12340,
    uploaderId: "user-3",
    uploaderName: "Alex Guitar",
    status: "published",
    createdAt: "2023-05-12",
    hasValidChords: true,
    chordSheet: `[Intro]
C  Am  C  Am

[Verse 1]
        C                 Am
I heard there was a secret chord
     C                    Am
That David played and it pleased the lord
     F                G             C        G
But you don't really care for music, do you
       C                   F        G
It goes like this, the fourth, the fifth
    Am              F
The minor fall and the major lift
    G               E7            Am
The baffled king composing Hallelujah

[Chorus]
F           Am          F           C    G    C  Am  C  Am
Hallelujah, Hallelujah, Hallelujah, Hallelu - jah

[Verse 2]
        C                     Am
Your faith was strong but you needed proof
    C                Am
You saw her bathing on the roof
    F               G            C         G
Her beauty and the moonlight overthrew you`,
  },
  {
    id: "song-5",
    title: "Sweet Home Alabama",
    artist: "Lynyrd Skynyrd",
    genre: "Rock",
    tags: ["70s", "southern rock", "classic"],
    difficulty: "Beginner",
    rating: 4.6,
    views: 9870,
    uploaderId: "user-2",
    uploaderName: "Jane Doe",
    status: "published",
    createdAt: "2023-06-08",
    hasValidChords: true,
    chordSheet: `[Intro]
D  C  G (x4)

[Verse 1]
D       C           G
Big wheels keep on turning
D       C            G
Carry me home to see my kin
D       C              G
Singing songs about the Southland
D       C                G
I miss Alabamy once again and I think it's a sin, yes

[Chorus]
D   C       G
Sweet home Alabama
D       C         G
Where the skies are so blue
D   C       G
Sweet home Alabama
D          C            G
Lord, I'm coming home to you

[Verse 2]
D         C            G
In Birmingham they love the governor, boo boo boo
D         C               G
Now we all did what we could do`,
  },
  {
    id: "song-6",
    title: "Let It Be",
    artist: "The Beatles",
    genre: "Rock",
    tags: ["60s", "classic", "piano"],
    difficulty: "Beginner",
    rating: 4.8,
    views: 21500,
    uploaderId: "user-1",
    uploaderName: "John Doe",
    status: "published",
    createdAt: "2023-07-01",
    hasValidChords: true,
    chordSheet: `[Verse 1]
       C                G
When I find myself in times of trouble
Am              F
Mother Mary comes to me
C                 G              F  C
Speaking words of wisdom, let it be
       C                 G
And in my hour of darkness
Am                 F
She is standing right in front of me
C                 G              F  C
Speaking words of wisdom, let it be

[Chorus]
Am         G
Let it be, let it be
F          C
Let it be, let it be
              G              F  C
Whisper words of wisdom, let it be`,
  },
  {
    id: "song-7",
    title: "Thinking Out Loud",
    artist: "Ed Sheeran",
    genre: "Pop",
    tags: ["2010s", "romantic", "wedding"],
    difficulty: "Intermediate",
    rating: 4.7,
    views: 16780,
    uploaderId: "user-3",
    uploaderName: "Alex Guitar",
    status: "published",
    createdAt: "2023-08-15",
    hasValidChords: true,
    chordSheet: `[Verse 1]
D        D/F#       G          A
When your legs don't work like they used to before
D        D/F#       G          A
And I can't sweep you off of your feet
D        D/F#       G          A
Will your mouth still remember the taste of my love
D        D/F#       G          A
Will your eyes still smile from your cheeks

[Chorus]
     Em      A         D
So honey now, take me into your loving arms
Em         A              D
Kiss me under the light of a thousand stars
Em         A             Bm   A
Place your head on my beating heart
             G         A           D
I'm thinking out loud, maybe we found love right where we are`,
  },
  {
    id: "song-8",
    title: "Stairway to Heaven",
    artist: "Led Zeppelin",
    genre: "Rock",
    tags: ["70s", "epic", "guitar solo"],
    difficulty: "Advanced",
    rating: 5.0,
    views: 28900,
    uploaderId: "user-1",
    uploaderName: "John Doe",
    status: "published",
    createdAt: "2023-09-01",
    hasValidChords: true,
    chordSheet: `[Intro - Fingerpicking]
Am  E+/G#  C/G  D/F#  Fmaj7  G  Am

[Verse 1]
Am           E+/G#           C/G         D/F#
There's a lady who's sure all that glitters is gold
        Fmaj7    G       Am
And she's buying a stairway to heaven
Am            E+/G#          C/G           D/F#
When she gets there she knows if the stores are all closed
         Fmaj7        G           Am
With a word she can get what she came for

[Bridge]
C    D     Fmaj7  Am    C       G        D
Ooh, ooh, and she's buying a stairway to heaven`,
  },
  {
    id: "song-9",
    title: "Bohemian Rhapsody",
    artist: "Queen",
    genre: "Rock",
    tags: ["70s", "epic", "opera"],
    difficulty: "Advanced",
    rating: 4.9,
    views: 25600,
    uploaderId: "user-2",
    uploaderName: "Jane Doe",
    status: "published",
    hasValidChords: false,
    createdAt: "2023-10-05",
    chordSheet: `[Intro]
Bb6  C7  Bb6  C7  F7

[Verse - A Cappella]
                    Bb6              C7
Is this the real life? Is this just fantasy?
F7                      Bb
Caught in a landslide, no escape from reality
Gm                     Bb7
Open your eyes, look up to the skies and see
Cm                     F7
I'm just a poor boy, I need no sympathy`,
  },
  {
    id: "song-10",
    title: "Photograph",
    artist: "Ed Sheeran",
    genre: "Pop",
    tags: ["2010s", "emotional", "acoustic"],
    difficulty: "Intermediate",
    rating: 4.6,
    views: 14200,
    uploaderId: "user-3",
    uploaderName: "Alex Guitar",
    status: "published",
    createdAt: "2023-10-12",
    hasValidChords: true,
    chordSheet: `[Verse 1]
E
Loving can hurt, loving can hurt sometimes
C#m
But it's the only thing that I know
B                    A
When it gets hard, you know it can get hard sometimes
E
It is the only thing that makes us feel alive

[Chorus]
    E
We keep this love in a photograph
    C#m
We made these memories for ourselves
         B                    A
Where our eyes are never closing, hearts are never broken
         E
And time's forever frozen still`,
  },
]

export const mockPlaylists = [
  {
    id: "playlist-1",
    name: "My Favorites",
    userId: "user-2",
    songIds: ["song-1", "song-3", "song-6"],
    createdAt: "2023-04-01",
  },
  {
    id: "playlist-2",
    name: "Campfire Songs",
    userId: "user-2",
    songIds: ["song-1", "song-4", "song-5", "song-6"],
    createdAt: "2023-05-15",
  },
  {
    id: "playlist-3",
    name: "Rock Classics",
    userId: "user-1",
    songIds: ["song-2", "song-5", "song-8"],
    createdAt: "2023-06-20",
  },
]

export const mockComments = [
  {
    id: "comment-1",
    songId: "song-1",
    userId: "user-2",
    username: "janedoe",
    text: "Great song! The chords are accurate and easy to follow.",
    rating: 5,
    createdAt: "2023-03-01",
  },
  {
    id: "comment-2",
    songId: "song-1",
    userId: "user-3",
    username: "guitarist88",
    text: "Classic! I play this at every campfire.",
    rating: 5,
    createdAt: "2023-03-15",
  },
  {
    id: "comment-6",
    songId: "song-1",
    userId: "user-1",
    username: "johndoe",
    text: "Perfect for beginners. The strumming pattern is really forgiving.",
    rating: 5,
    createdAt: "2023-07-22",
  },
  {
    id: "comment-3",
    songId: "song-2",
    userId: "user-1",
    username: "johndoe",
    text: "One of the best songs ever written. The chord progression is iconic.",
    rating: 5,
    createdAt: "2023-04-10",
  },
  {
    id: "comment-7",
    songId: "song-2",
    userId: "user-3",
    username: "guitarist88",
    text: "The intro riff is a bit tricky but sounds amazing once you get it down.",
    rating: 5,
    createdAt: "2023-04-25",
  },
  {
    id: "comment-4",
    songId: "song-3",
    userId: "user-2",
    username: "janedoe",
    text: "Fun song to play! The capo position makes it easier.",
    rating: 4,
    createdAt: "2023-05-20",
  },
  {
    id: "comment-8",
    songId: "song-3",
    userId: "user-1",
    username: "johndoe",
    text: "Great for practicing barre chords. Catchy tune!",
    rating: 4,
    createdAt: "2023-06-12",
  },
  {
    id: "comment-5",
    songId: "song-4",
    userId: "user-1",
    username: "johndoe",
    text: "Beautiful song. The fingerpicking pattern is a bit tricky but worth learning.",
    rating: 5,
    createdAt: "2023-06-05",
  },
  {
    id: "comment-9",
    songId: "song-4",
    userId: "user-2",
    username: "janedoe",
    text: "Absolutely stunning. My favorite song to play at weddings.",
    rating: 5,
    createdAt: "2023-06-20",
  },
  {
    id: "comment-10",
    songId: "song-5",
    userId: "user-3",
    username: "guitarist88",
    text: "Such a fun riff! Always gets people singing along.",
    rating: 5,
    createdAt: "2023-07-01",
  },
  {
    id: "comment-11",
    songId: "song-5",
    userId: "user-1",
    username: "johndoe",
    text: "Classic southern rock. The solo section needs more practice.",
    rating: 4,
    createdAt: "2023-07-15",
  },
  {
    id: "comment-12",
    songId: "song-6",
    userId: "user-2",
    username: "janedoe",
    text: "Timeless classic. The melody is so simple yet so powerful.",
    rating: 5,
    createdAt: "2023-08-01",
  },
  {
    id: "comment-13",
    songId: "song-6",
    userId: "user-3",
    username: "guitarist88",
    text: "Perfect song for beginners to learn chord changes. Sounds great on piano too.",
    rating: 5,
    createdAt: "2023-08-10",
  },
  {
    id: "comment-14",
    songId: "song-7",
    userId: "user-1",
    username: "johndoe",
    text: "Romantic and beautiful. The chord progression flows really nicely.",
    rating: 5,
    createdAt: "2023-09-01",
  },
  {
    id: "comment-15",
    songId: "song-7",
    userId: "user-2",
    username: "janedoe",
    text: "Love this song! Played it at my wedding. Chord changes are smooth.",
    rating: 5,
    createdAt: "2023-09-20",
  },
  {
    id: "comment-16",
    songId: "song-8",
    userId: "user-3",
    username: "guitarist88",
    text: "Epic masterpiece! The build-up from acoustic to electric is legendary.",
    rating: 5,
    createdAt: "2023-10-01",
  },
  {
    id: "comment-17",
    songId: "song-8",
    userId: "user-2",
    username: "janedoe",
    text: "This is THE song every guitarist should learn. The solo is challenging but rewarding.",
    rating: 5,
    createdAt: "2023-10-15",
  },
  {
    id: "comment-18",
    songId: "song-9",
    userId: "user-1",
    username: "johndoe",
    text: "The chord sheet is missing some sections. Would love a complete version!",
    rating: 3,
    createdAt: "2023-11-01",
  },
  {
    id: "comment-19",
    songId: "song-9",
    userId: "user-3",
    username: "guitarist88",
    text: "Incomplete but what's here is accurate. Looking forward to the full version.",
    rating: 3,
    createdAt: "2023-11-10",
  },
  {
    id: "comment-20",
    songId: "song-10",
    userId: "user-2",
    username: "janedoe",
    text: "Emotional and beautiful. The acoustic version is perfect for practice.",
    rating: 5,
    createdAt: "2023-11-20",
  },
  {
    id: "comment-21",
    songId: "song-10",
    userId: "user-1",
    username: "johndoe",
    text: "Great song for intermediate players. The fingerpicking pattern is lovely.",
    rating: 4,
    createdAt: "2023-11-25",
  },
]

export const CHORD_NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

export const GENRES = ["Rock", "Pop", "Folk", "Country", "Jazz", "Blues", "R&B", "Classical"]

export const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"]
