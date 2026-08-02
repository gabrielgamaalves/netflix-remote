import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/Card";
import { RemoteControl } from "@/components/ui/RemoteControl";

import { usePageTitle } from "@/hooks/usePageTitle";

export default function Browse() {
  usePageTitle("Browse")

  const profileImageUrl =
    "https://occ-0-2812-3851.1.nflxso.net/dnm/api/v6/SO2HoVCx33X8phZh2pZZmQ4QgNY/AAAABXu57DFg_biFC-uXP7PeOe0SS1oKcRYEQd8ZRMVRFunC0GFGyKG4uYkgq0kUIx4qlncM_EtP4Mq_QqfKtRweia33ROKsepI.png?r=937";

  const cardImageUrl =
    "https://occ-0-2812-3851.1.nflxso.net/dnm/api/v6/0Qzqdxw-HG1AiOKLWWPsFOUDA2E/AAAABd7vbpNv1aq0uwpPuBvoqVxeFElFlKJRtQRYjUfFgB-AlJWe3EH0_Yx0wQGfsqMutXScvtXXYpZYIzAVK-odav0OKtcS2yaS-1T3H5Dm4Z1cAfrB73WuAmmX8AbnCUzBHo-4473ELlXtw1sx.webp?r=679";

  return (
    <>
      <Header profileImageUrl={profileImageUrl} />
      <Card imageUrl={cardImageUrl}/>
      <RemoteControl />
    </>
  );
}
