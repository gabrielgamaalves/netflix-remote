import { RiArrowDropDownLine, RiSettings2Line } from "react-icons/ri";

export function Header({ onSettingsClick, onProfileClick, profileImageUrl }) {
  return (
    <header className="flex-between py-6">
      <nav className="flex gap-2">
        <button
          className="px-5 py-2 rounded-xl text-sm font-medium bg-btn-bg transition-all"
          aria-current="page"
        >
          Início
        </button>

        <button className="px-5 py-2 rounded-full text-sm font-medium flex items-center gap-1 hover:bg-hover-bg transition-all">
          Mais
          <RiArrowDropDownLine size={18} />
        </button>
      </nav>

      <div className="flex items-center gap-3">
        <button
          onClick={onSettingsClick}
          aria-label="Configurações"
          className="size-10 rounded-full bg-btn-bg flex-center transition-all hover:bg-hover-bg"
        >
          <RiSettings2Line size={18} />
        </button>

        <button
          className="flex-center rounded-xl hover:bg-hover-bg gap-1 pr-1"
          onClick={onProfileClick}
          aria-label="Perfil"
        >
          <img
            className="size-10 rounded-xl object-cover hover:bg-background transition-all"
            src={profileImageUrl}
            alt=""
          />
          <RiArrowDropDownLine size={18} />
        </button>
      </div>
    </header>
  );
}
