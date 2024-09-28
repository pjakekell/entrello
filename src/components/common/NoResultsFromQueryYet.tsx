import React from "react"

export default function NoResultsFromQueryYet({ message }: { message: string }) {
    return (
        <div className="text-center my-28">
            <div className="text-lg">{message}</div>
        </div>
    );
};
