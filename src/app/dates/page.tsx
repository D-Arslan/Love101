import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Logo } from "@/components/shared/Logo"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Idees de Date A-Z",
  description:
    "26 idees de rendez-vous amoureux originaux, une pour chaque lettre de l'alphabet. Trouve l'inspiration pour ton prochain date !",
}

const dateIdeas: { letter: string; title: string; description: string; emoji: string }[] = [
  { letter: "A", title: "Atelier cuisine", description: "Preparez un plat ensemble : sushi, pizza maison, ou patisserie. Le resultat compte moins que les fous rires.", emoji: "👨‍🍳" },
  { letter: "B", title: "Balade au coucher de soleil", description: "Trouvez un beau point de vue, emportez une couverture et admirez le ciel ensemble.", emoji: "🌅" },
  { letter: "C", title: "Cinema en plein air", description: "Installez un drap blanc, un projecteur, des coussins et du popcorn. Votre cinema prive.", emoji: "🎬" },
  { letter: "D", title: "Degustation a l'aveugle", description: "Bandez-vous les yeux et devinez des chocolats, fromages ou vins. Celui qui perd fait la vaisselle.", emoji: "🍫" },
  { letter: "E", title: "Escape game", description: "Testez votre complicite en resolvant des enigmes ensemble. Rien de tel pour renforcer le duo.", emoji: "🔐" },
  { letter: "F", title: "Fete foraine", description: "Barbe a papa, grande roue et peluches gagnees. Retrouvez votre ame d'enfant.", emoji: "🎡" },
  { letter: "G", title: "Game night", description: "Jeux de societe, jeux video en duo ou bataille de cartes. La competition saine, ca rapproche.", emoji: "🎮" },
  { letter: "H", title: "Hotel mystere", description: "Reservez un hotel surprise dans votre ville et jouez aux touristes pour une nuit.", emoji: "🏨" },
  { letter: "I", title: "Improvisation", description: "Prenez un cours d'impro ensemble ou inventez des scenes a la maison. Fous rires garantis.", emoji: "🎭" },
  { letter: "J", title: "Jardin botanique", description: "Promenez-vous parmi les fleurs, respirez les parfums et prenez de belles photos ensemble.", emoji: "🌺" },
  { letter: "K", title: "Karaoke", description: "Louez une salle privee et chantez vos chansons preferees sans complexe. Duos obligatoires.", emoji: "🎤" },
  { letter: "L", title: "Lettre d'amour", description: "Ecrivez-vous chacun une lettre et lisez-la a voix haute. Intime et inoubliable.", emoji: "💌" },
  { letter: "M", title: "Marche nocturne", description: "Explorez un marche de nuit, goutez des plats du monde et flanez main dans la main.", emoji: "🌙" },
  { letter: "N", title: "Nuit a la belle etoile", description: "Emportez des couvertures, trouvez un endroit calme et observez les etoiles ensemble.", emoji: "⭐" },
  { letter: "O", title: "Origami a deux", description: "Suivez des tutoriels et creez des grues, coeurs ou fleurs en papier. Offrez-vous vos creations.", emoji: "🦢" },
  { letter: "P", title: "Pique-nique gastronomique", description: "Preparez un panier avec vos plats preferes, une bonne bouteille, et trouvez le spot parfait.", emoji: "🧺" },
  { letter: "Q", title: "Quiz sur votre couple", description: "Testez combien vous vous connaissez avec des questions sur vos gouts, souvenirs et reves.", emoji: "❓" },
  { letter: "R", title: "Road trip spontane", description: "Montez en voiture sans destination. Arretez-vous la ou ca vous plait. L'aventure commence.", emoji: "🚗" },
  { letter: "S", title: "Spa maison", description: "Bougies, musique douce, masques, massages. Transformez votre salle de bain en institut.", emoji: "🧖" },
  { letter: "T", title: "Thrift shopping", description: "Allez dans des friperies et choisissez-vous mutuellement une tenue complete. Defi mode.", emoji: "👗" },
  { letter: "U", title: "Un concert en live", description: "Decouvrez un artiste local dans un bar ou une petite salle. La musique live a un charme unique.", emoji: "🎵" },
  { letter: "V", title: "Visite de musee", description: "Choisissez une expo qui vous intrigue et discutez de vos impressions devant un cafe apres.", emoji: "🖼️" },
  { letter: "W", title: "Weekend sans telephone", description: "Deconnectez-vous 48h et concentrez-vous l'un sur l'autre. Digital detox en amoureux.", emoji: "📵" },
  { letter: "X", title: "eXperience insolite", description: "Saut en parachute, cours de poterie, bain flottant... Choisissez quelque chose que ni l'un ni l'autre n'a fait.", emoji: "🪂" },
  { letter: "Y", title: "Yoga en duo", description: "Essayez le yoga a deux avec des postures synchronisees. Equilibre, confiance et connexion.", emoji: "🧘" },
  { letter: "Z", title: "Zoo ou aquarium", description: "Emerveillez-vous devant les animaux comme des enfants. Choisissez chacun votre animal prefere.", emoji: "🐧" },
]

export default function DatesPage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Header */}
      <div className="text-center px-4 pt-12 pb-8">
        <div className="flex justify-center mb-3">
          <Logo size="lg" />
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          Idees de Date{" "}
          <span className="bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">
            A — Z
          </span>
        </h1>
        <p className="text-gray-600 max-w-lg mx-auto text-lg">
          26 idees de rendez-vous, une pour chaque lettre.
          Trouve l&apos;inspiration et surprends ton/ta partenaire.
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-5xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {dateIdeas.map((idea) => (
            <div
              key={idea.letter}
              className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-rose-100 to-purple-100 flex items-center justify-center shrink-0">
                  <span className="font-serif text-xl font-bold bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">
                    {idea.letter}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 flex items-center gap-2">
                    <span className="text-lg">{idea.emoji}</span>
                    {idea.title}
                  </p>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                    {idea.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Tu as trouve l&apos;idee parfaite ? Invite ton/ta partenaire avec un message personnalise.
          </p>
          <Link href="/create?template=rdv">
            <Button className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white px-8 py-6 rounded-full text-lg">
              Creer une invitation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
