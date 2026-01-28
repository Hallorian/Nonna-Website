import { Content } from './types';

// Placeholder mapping for images - in a real scenario these would be the actual file paths
// Since we are simulating, we assume these filenames align with the upload.
export const IMAGES = {
  poster: 'https://i.imgur.com/PosterPlaceholder.jpg', // Replaced by user uploaded asset logic in App.tsx
  vincent: 'https://i.imgur.com/VincentPlaceholder.jpg',
  stills: [
    'still1.jpg',
    'still2.jpg',
    'still3.jpg',
    'still4.jpg',
    'still5.jpg',
    'still6.jpg'
  ]
};

export const TEXT_CONTENT: Content = {
  en: {
    logline: "After more than 30 years as a migrant worker, Nonna lives alone in the house she built herself in southern Italy. Her family remained in Germany. What to do with a legacy that no one wants?",
    synopsis: `Nonna [Italian for grandmother] is alone. Alone in southern Italy. There she works hard every day for her legacy – a gigantic house. Built by her and her husband with their own hands, with the hard-earned Deutschmarks from over three decades of guest work in Germany. It was originally intended as security for the whole family, but they remained in Germany when Rosa moved there in the late 1990s. Since her husband died, she has been running a two-storey bed and breakfast on her own, which has seen better days. Her daily routines are marked by hardship and disappointment: the hard work doesn't get any easier with age, cleaning staff are hard to find, and the region is in decline. She reluctantly dependents on the help of day labourer Ali.\n\nNonna is in a bad mood, complaining silently and arguing loudly with her brother, who lives next door. Video calls with her sister, her children and grandchildren keep her in touch with Germany. The family is far away and the connection is often poor. Nonna increasingly disappears into the structures of the house. Stubborn, loud and thoughtful, she fights against the knowledge that she will soon have to make a decision. What to do with a legacy that no one wants?`,
    directorStatement: `One thousand five hundred kilometres lie between Nonna and us. Her family. Every time we back out of the driveway after a visit, she stands there and waves. She looks sad and so small in front of the huge house, the monument to her work, her aspirations in Germany. The flags wave untouched as we leave Nonna behind in her homeland and drive back to ours. The history of guest workers in Germany is also hers. A house big enough for everyone in southern Italy, the family in Germany. This film approaches her biography, her everyday life and her loneliness in imperfect, unmoving images.`,
    bio: "Vincent Graf was born in Germany in 1996 to German-Italian parents. He first studied film at Dortmund University of Applied Sciences and Arts, where he worked on both documentary and fictional projects. Since 2023, he has been deepening his exploration of real-life subjects at the Academy of Media Arts Cologne (KHM).",
    filmography: [
      "“Nonna” / Vincent Graf / 2025 / 72 min / Documentary",
      "“Sixteen Thousand Kilometres” / 2023 / 29 min / Short film",
      "“Kontakt” / Vincent Graf /2023 / 8 min / Experimental Doc",
      "“Sleep Paralysis” / Vincent Graf / 2022 / 59 min / Documentary"
    ],
    quotes: [
      {
        author: "Jan Künemund",
        source: "DOK Leipzig",
        text: ["“Nonna” is a tribute to his grandmother by her filmmaker grandson that captures people, places and times with precision and subtle humour, portraying a life journey between two homelands that did not work out as imagined."]
      },
      {
        author: "Norbert Wehrstedt",
        source: "Leipziger Volkszeitung",
        text: ["Nonna’ by Vincent Graf is a familiar, private reflection of the times: a portrait of an Italian woman from Maruggio. [...] Everything is carefully observed and succinctly expressed. A cinematic declaration of love from her grandson."]
      },
      {
        author: "Barbara Schweizerhof",
        source: "Der Freitag",
        text: [
          "The film is an affectionate, spirited portrait of the filmmaker’s larger-than-life grandmother, whose vibrant, sharp-witted presence illuminates every frame. [...] Graf captures her with tenderness and humour, reminding us that old age can be lived on one’s own terms — whether with a mischievous smile, a razor-sharp tongue, or both.",
          "The grandmother Vincent Graf depicts in Nonna, on the other hand, is a true bastion of defiance. [...] Grandson Vincent does not shy away from the contradictions of this prickly, often grumpy woman, maintaining an openness that encourages deeper reflection on the unique life situation of this generation of ‘guest workers’."
        ]
      },
      {
        author: "André Pitz",
        source: "",
        text: [
          "A woman caught between two worlds; constantly willing to give up everything and at the same time carry on until she drops; in constant contact with her friends via mobile phone, only to cut them off mid-conversation.",
          "NONNA reveals the defining idiosyncrasies and contradictions of our time. On the one hand, thanks to a united Europe (in the sense of the European Union), we enjoy enormous freedoms. However, it is precisely these freedoms that can cause us to drift apart again, while permanent digital accessibility creates a false sense of connectedness.",
          "The film is haunted by a sense of nostalgia that pushes it’s way to the surface more and more clearly as it becomes clearer what is at stake, what will endure and what perhaps will not."
        ]
      },
      {
        author: "Greta Eising",
        source: "Luhze",
        text: [
          "Vincent Graf portrays his Italian grandmother Rosa – tough, grumpy and quite funny. Her bed and breakfast becomes a monument to an entire generation. [...]",
          "What could easily begin as a sentimental family story turns out to be a precise, witty and deeply melancholische study of loneliness, pride and the failure of the concept of home. [...]",
          "Slowness is the order of the day. It forces us to think at Rosa’s pace – the pace of a woman who is no longer in a hurry, but also has no destination. Nonna is a portrait of stagnation – but one that lives, pulsates and contradicts. [...]",
          "Between possession and loss, home and uprooting, laughter and sighs, Nonna oscillates back and forth like the sea that Rosa loves. And we, the audience, stand on the shore and know: this is what lived history looks like. [...]",
          "Perhaps the most beautiful thing about this film is that it is made with love, but never becomes sentimental. Graf celebrates his grandmother not as a heroine, but as a human being – stubborn, funny, lonely, lively. His mother calls Rosa ‘sprightly and tough’. That sums it up. And Nonna is exactly that: a sprightly, tough film. Not a monument made of marble, but one made of everyday dust and soapy water. [...]",
          "Nonna shows what happens when the great stories of Europe – Migration, family, work, old age – shrink to the size of a kitchen with an oilcloth tablecloth. Tragic, funny, true."
        ]
      }
    ],
    specs: {
      duration: "72min",
      resolution: "2K DCP Flat (1998x1080p)",
      framerate: "25fps",
      aspectRatio: "1.85:1",
      sound: "5.1",
      language: "Italienisch, Deutsch",
      subtitles: "Deutsch, Englisch, Italienisch"
    },
    festivals: [
      "68. International Leipzig Festival for Documentary and Animated Film\nGerman Competition | 2025",
      "Stranger than Fiction Filmfest | 2026"
    ],
    pastEvents: [
      {
        title: "28. Stranger than Fiction Filmfest 2026"
      },
      {
        title: "68. International Leipzig Festival for Documentary and Animated Film",
        subtitle: "German Competition 2025"
      }
    ],
    upcomingEvents: [
      {
        title: "Cinema-Tour 2026",
        subtitle: "Dates to be announced"
      }
    ],
    screenings: [
      { city: "Berlin", cinema: "Delphi Lux", date: "15.05.2026", time: "20:00" },
      { city: "Cologne", cinema: "Filmpalette", date: "20.05.2026", time: "19:00" },
      { city: "Munich", cinema: "Monopol", date: "25.05.2026", time: "20:30" }
    ]
  },
  de: {
    logline: "Nach über 30 Jahren Gastarbeit lebt Nonna allein im eigens gebauten Haus in Süditalien. Die Familie blieb in Deutschland. Was tun mit einem Vermächtnis, das niemand haben will?",
    synopsis: `Nonna [it. Großmutter] ist allein. Allein in Süditalien. Dort schuftet sie sich täglich für ihr Vermächtnis ab – ein riesiges Haus. Eigenhändig von ihr und ihrem Mann erbaut, mit den hart erarbeiteten D-Mark aus über drei Jahrzehnten der Gastarbeit in Deutschland. Es war ursprünglich als Sicherheit für die ganze Familie gedacht, aber die blieb in Deutschland, als Rosa Ende der 1990er dort einzog. Seit ihr Mann gestorben ist, betreibt sie darin allein ein doppelstöckiges Bed and Breakfast, das seine beste Zeit bereits hinter sich hat. Ihre täglichen Routinen sind von Mühsal und Enttäuschung geprägt: Die Schufterei wird im Alter nicht leichter, Reinigungskräfte sind schwer zu finden, mit der Region geht es immer weiter abwärts. Dabei ist sie widerwillig auf die Hilfe des Tagelöhners Ali angewiesen.\n\nNonna hat schlechte Laune, beklagt sich im Stillen und streitet laut mit dem Bruder, der nebenan wohnt. Videoanrufe mit der Schwester, ihren Kindern und Enkeln halten den Kontakt zu Deutschland aufrecht. Die Familie ist weit weg und die Verbindung oft schlecht. Zunehmend verschwindet Nonna in den Strukturen des Hauses. Starrköpfig, laut und nachdenklich kämpft sie gegen das Wissen an, dass sie bald eine Entscheidung treffen muss. Was tun mit einem Vermächtnis, das niemand haben will?`,
    directorStatement: `1.500 Kilometer liegen zwischen Nonna und uns. Ihrer Familie. Jedes Mal, wenn wir nach einem Besuch mit dem Auto aus der Einfahrt zurücksetzten, steht sie da und winkt. Sie wirkt traurig und so klein vor dem riesigen Haus, dem Monument ihrer Arbeit, ihres Strebens in Deutschland. Die Flaggen winken unberührt mit, während wir Nonna in ihrer Heimat zurücklassen und zurück in unsere fahren. Die Gastarbeitergeschichte Deutschlands ist auch ihre. Ein Haus, groß genug für alle in Süditalien, die Familie in Deutschland. Dieser Film nähert sich in dekadrierten, unbewegten Einstellungen ihrer Biografie, ihrem Alltag und ihrem Alleinsein an.`,
    bio: "Vincent Graf wurde 1996 als Sohn deutsch-italienischer Eltern in Deutschland geboren. Er studierte zunächst Film an der FH Dortmund, wo er sowohl dokumentarisch als auch fiktional arbeitete. Seit 2023 vertieft er an der Kunsthochschule für Medien Köln (KHM) seine Auseinandersetzung mit in der Wirklichkeit gefundenen Stoffen.",
    filmography: [
      "“Nonna” / Vincent Graf / 2025 / 72 min / Documentary",
      "“Sixteen Thousand Kilometres” / 2023 / 29 min / Short film",
      "“Kontakt” / Vincent Graf /2023 / 8 min / Experimental Doc",
      "“Sleep Paralysis” / Vincent Graf / 2022 / 59 min / Documentary"
    ],
    quotes: [
      {
        author: "Jan Künemund",
        source: "DOK Leipzig",
        text: ["„Nonna“ ist eine Würdigung der Großmutter durch ihren filmemachenden Enkel, die präzise und mit leisem Witz Menschen, Orte und Zeit erfasst, und von einer Lebensbewegung zwischen zwei Heimaten erzählt, die nicht so verlaufen ist, wie man sich das einmal vorgestellt hat."]
      },
      {
        author: "Norbert Wehrstedt",
        source: "Leipziger Volkszeitung",
        text: ["„Nonna“ von Vincent Graf ist ein familiärer, also privater Spiegel der Zeiten: Porträt einer Italienerin aus Maruggio. […] Alles genau beobachtet und auf den Punkt gebracht. Eine filmische Liebeserklärung des Enkels."]
      },
      {
        author: "Barbara Schweizerhof",
        source: "Der Freitag",
        text: [
          "Die Großmutter, die Vincent Graf in Nonna zeigt, ist dagegen ein wahres Bollwerk des Trotzes. […] Enkel Vincent schreckt vor der Widersprüchlichkeit der stachligen, oft missgelaunten Frau nicht zurück, belässt dabei eine Offenheit, die zur tieferen Reflexion über die besondere Lebenssituation dieser Generation der „Gastarbeiter“ anregt.",
          "Der Film ist ein liebevolles, lebhaftes Porträt der überlebensgroßen Großmutter des Filmemachers, deren lebhafte, scharfsinnige Präsenz jeden einzelnen Bildausschnitt erhellt. […] Graf fängt sie mit Zärtlichkeit und Humor ein und erinnert uns daran, dass man das Alter nach seinen eigenen Vorstellungen leben kann – sei es mit einem verschmitzten Lächeln, einer messerscharfen Zunge oder beidem."
        ]
      },
      {
        author: "André Pitz",
        source: "",
        text: [
          "Eine Frau, gefangen zwischen zwei Welten; ständig gewillt, alles hinzuschmeißen und gleichzeitig weiterzumachen, bis sie umfällt; über das Handy in permanentem Kontakt mit Freundinnen, die sie dann doch im Gespräch abwürgt.",
          "NONNA offenbart dabei die prägenden Idiosynkrasien und Widersprüche unserer Zeit. Einerseits genießen wir dank eines vereinten Europas (im Sinne der Europäischen Union) enorme Freiheiten. Jedoch sind es genau diese Freiheiten, die uns auch räumlich wieder auseinanderdriften lassen können, während die permanente digitale Erreichbarkeit ein falsches Gefühl von Verbundenheit erzeugt.",
          "Der Film wird heimgesucht von einer vorauseilenden Nostalgie, die immer klarer an die Oberfläche drängt, je deutlicher wird, was auf dem Spiel steht, was Bestand haben wird und was vielleicht nicht."
        ]
      },
      {
        author: "Greta Eising",
        source: "Luhze",
        text: [
          "Vincent Graf porträtiert seine italienische Großmutter Rosa – zäh, grantig und dabei ziemlich komisch. Ihr Bed & Breakfast wird zum Denkmal einer ganzen Generation. […]",
          "Was leicht als sentimentale Familiengeschichte beginnen könnte, entpuppt sich als präzise, witzige und zutiefst melancholische Studie über Einsamkeit, Stolz und das Scheitern des Heimatbegriffs. […]",
          "Die Langsamkeit ist Programm. Sie zwingt uns, in Rosas Rhythmus zu denken – dem Rhythmus einer Frau, die keine Eile mehr hat, aber auch kein Ziel. Nonna ist ein Porträt des Stillstands – aber eines, das lebt, pulsiert, widerspricht. […]",
          "Zwischen Besitz und Verlust, Heimat und Entwurzelung, Lachen und Seufzen pendelt Nonna hin und her wie das Meer, das Rosa liebt. Und wir, das Publikum, stehen am Ufer und wissen: So sieht gelebte Geschichte aus. […]",
          "Vielleicht ist das Schönste an diesem Film, dass er aus Liebe gemacht ist, aber nie sentimental wird. Graf feiert seine Großmutter nicht als Heldin, sondern als Mensch – störrisch, witzig, einsam, lebendig. Seine Mutter nennt Rosa „rüstig und zäh“. Das trifft es. Und Nonna ist genau das: ein rüstiger, zäher Film. Kein Denkmal aus Marmor, sondern eines aus Alltagsstaub und Seifenwasser. […]",
          "Nonna zeigt, was passiert, wenn die großen Geschichten Europas – Migration, Familie, Arbeit, Alter – auf die Größe einer Küche mit Wachstuchdecke schrumpfen. Tragisch, komisch, wahr."
        ]
      }
    ],
    specs: {
      duration: "72min",
      resolution: "2K DCP Flat (1998x1080p)",
      framerate: "25fps",
      aspectRatio: "1.85:1",
      sound: "5.1",
      language: "Italienisch, Deutsch",
      subtitles: "Deutsch, Englisch, Italienisch"
    },
    festivals: [
      "68. International Leipzig Festival for Documentary and Animated Film\nDeutscher Wettbewerb 2025",
      "Stranger than Fiction Filmfest 2026"
    ],
    pastEvents: [
      {
        title: "28. Stranger than Fiction Filmfest 2026"
      },
      {
        title: "68. Internationales Leipziger Festival für Dokumentar- und Animationsfilm",
        subtitle: "Deutscher Wettbewerb 2025"
      }
    ],
    upcomingEvents: [
      {
        title: "Kinotour 2026",
        subtitle: "Termine werden bekanntgegeben"
      }
    ],
    screenings: [
      { city: "Berlin", cinema: "Delphi Lux", date: "15.05.2026", time: "20:00" },
      { city: "Köln", cinema: "Filmpalette", date: "20.05.2026", time: "19:00" },
      { city: "München", cinema: "Monopol", date: "25.05.2026", time: "20:30" }
    ]
  }
};