import './Main.scss';

export default function Main({ children }: { children: React.ReactNode }) {
    return (
        <main className="main">
            <div className="main-content">
                {children}
            </div>
        </main>
    );
}
