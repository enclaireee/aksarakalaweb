import { SiteChrome } from "@/components/SiteChrome";
import { GateScene } from "@/components/scenes/GateScene";
import { GameScene } from "@/components/scenes/GameScene";
import { CastScene } from "@/components/scenes/CastScene";
import { PathsScene } from "@/components/scenes/PathsScene";
import { JourneyScene } from "@/components/scenes/JourneyScene";
import { BossesScene } from "@/components/scenes/BossesScene";
import { DownloadScene } from "@/components/scenes/DownloadScene";

export default function Home() {
  return (
    <main>
      <SiteChrome />
      <GateScene />
      <GameScene />
      <CastScene />
      <PathsScene />
      <JourneyScene />
      <BossesScene />
      <DownloadScene />
    </main>
  );
}
