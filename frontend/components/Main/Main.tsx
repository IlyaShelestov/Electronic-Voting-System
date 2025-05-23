import "./Main.scss";
export default function Main({ children }: { children: React.ReactNode }) {
    return (
        <main className="main">
            {children}
        </main>
    );
}
