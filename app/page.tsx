import { SiteChrome } from "@/components/SiteChrome";
import { GateScene } from "@/components/scenes/GateScene";
import { KelirScene } from "@/components/scenes/KelirScene";
import { ForgottenScene } from "@/components/scenes/ForgottenScene";
import { CastScene } from "@/components/scenes/CastScene";
import { JourneyScene } from "@/components/scenes/JourneyScene";
import { BossesScene } from "@/components/scenes/BossesScene";
import { PathsScene } from "@/components/scenes/PathsScene";
import { KalaScene } from "@/components/scenes/KalaScene";
import { DownloadScene } from "@/components/scenes/DownloadScene";

export default function Home() {
  return (
    <main>
      <SiteChrome />
      <GateScene />
      <KelirScene />
      <ForgottenScene />
      <CastScene />
      <JourneyScene />
      <BossesScene />
      <PathsScene />
      <KalaScene />
      <DownloadScene />
    </main>
  );
}
