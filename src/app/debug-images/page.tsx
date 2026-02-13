import React from 'react';

const sections = [
    'training',
    'essence',
    'transformation',
    'why-team',
    'facilities',
    'plans',
    'footer'
];

export default function DebugImagesPage() {
    return (
        <div className="min-h-screen bg-white text-black p-8">
            <h1 className="text-3xl font-bold mb-8">Debug Assets: /assets/sections/</h1>

            <div className="grid gap-8">
                {sections.map(section => (
                    <div key={section} className="border p-4 rounded bg-gray-100">
                        <h2 className="text-xl font-bold mb-4 capitalize">{section}</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="mb-2 font-mono text-sm">Desktop: /assets/sections/{section}-desktop.png</p>
                                <img
                                    src={`/assets/sections/${section}-desktop.png`}
                                    alt={`${section} desktop`}
                                    className="w-full h-auto border-2 border-green-500 bg-checkerboard"
                                />
                            </div>
                            <div>
                                <p className="mb-2 font-mono text-sm">Mobile: /assets/sections/{section}-mobile.png</p>
                                <img
                                    src={`/assets/sections/${section}-mobile.png`}
                                    alt={`${section} mobile`}
                                    className="w-full max-w-[300px] h-auto border-2 border-blue-500 bg-checkerboard"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <style jsx global>{`
        .bg-checkerboard {
          background-image:
            linear-gradient(45deg, #ccc 25%, transparent 25%),
            linear-gradient(-45deg, #ccc 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #ccc 75%),
            linear-gradient(-45deg, transparent 75%, #ccc 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        }
      `}</style>
        </div>
    );
}
