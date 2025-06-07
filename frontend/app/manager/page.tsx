"use client";
import './Manager.scss';

import Link from 'next/link';

export default function ManagerPage() {
    return (
        <div className="manager-page">
            <div className="manager-nav">
                <div className="manager-nav-item">
                    <Link href="/manager/elections">Elections</Link>
                    <Link href="/manager/candidates">Candidates</Link>
                    <Link href="/manager/events">Events</Link>
                </div>
            </div>
        </div>
    );
}
