import SettingsNavigationBar from "./_components/SettingsNavigation";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="flex h-full w-full flex-1 items-start justify-start gap-4 p-4">
            <div className="p-2 bg-white border border-zinc-200 rounded-sm shadow-sm ">
                <SettingsNavigationBar />
            </div>
            {children}
        </main>
    );
}