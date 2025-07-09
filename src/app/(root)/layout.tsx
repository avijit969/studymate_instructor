import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import NavBar from "@/components/nav-bar";


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <SidebarProvider>
                <AppSidebar />
                <div className="w-full">
                    <NavBar />
                    {children}
                </div>
            </SidebarProvider>
        </>
    );
}
