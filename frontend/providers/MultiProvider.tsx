import ReduxProvider from "@/providers/StoreProvider";

export default function MultiProvider({
                                          children,
                                      }: {
    children: React.ReactNode;
}) {
    return <ReduxProvider>
                {children}
    </ReduxProvider>;
}