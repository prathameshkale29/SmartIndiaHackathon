function ISROMap({
    height = "400px",
    markers = [],
    routes = [],
    center = { lat: 20.5937, long: 78.9629 }, // Default Center India
    zoom = 5,
    title = "ISRO Bhuvan Geospatial View"
}) {
    // Determine active point to focus on (first marker or center)
    const activePoint = markers.length > 0 ? markers[0] : center;

    return (
        <div className="card p-0 overflow-hidden border-2 border-blue-900/20 shadow-lg relative" style={{ height: height }} data-file="components/ISROMap.js">
            {/* Header / Toolbar */}
            <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4 flex justify-between items-start text-white">
                <div>
                    <h3 className="font-bold flex items-center gap-2 text-shadow-sm">
                        <img src="https://bhuvan-app1.nrsc.gov.in/bhuvan2d/bhuvan/images/bhuvan.png" alt="ISRO" className="h-5 opacity-90" onError={(e) => e.target.style.display = 'none'} />
                        {title}
                    </h3>
                    <p className="text-[10px] opacity-80 font-mono">LAT: {activePoint.lat?.toFixed(4)} | LONG: {activePoint.long?.toFixed(4)}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <span className="bg-blue-600 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider">SATELLITE FEED</span>
                    <span className="text-[10px] opacity-70">Res: 10m | Data: IRS-P6</span>
                </div>
            </div>

            {/* Map Visual (CSS Simulation) */}
            <div className="w-full h-full bg-[#1a2c38] relative overflow-hidden group cursor-move">
                {/* 1. Base Satellite Texture Simulation */}
                <div className="absolute inset-0 opacity-40 mix-blend-overlay" style={{
                    backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")', // Noise texture
                    backgroundSize: '200px'
                }}></div>

                {/* 2. Grid System */}
                <div className="absolute inset-0 pointer-events-none" style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
                    backgroundSize: '100px 100px'
                }}></div>

                {/* 3. Routes (SVG Lines) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {routes.map((route, idx) => (
                        <g key={idx}>
                            {/* animated path */}
                            <line
                                x1={`${route.from.x}%`} y1={`${route.from.y}%`}
                                x2={`${route.to.x}%`} y2={`${route.to.y}%`}
                                stroke={route.color || "#3b82f6"}
                                strokeWidth="2"
                                strokeDasharray="5,5"
                                className="animate-dash"
                            />
                            <circle cx={`${route.to.x}%`} cy={`${route.to.y}%`} r="3" fill={route.color || "#3b82f6"} className="animate-ping" />
                        </g>
                    ))}
                </svg>

                {/* 4. Markers */}
                {markers.map((marker, idx) => (
                    <div
                        key={idx}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 group/marker hover:z-50 transition-all duration-500"
                        style={{ top: `${marker.y || 50}%`, left: `${marker.x || 50}%` }}
                    >
                        {/* Pulse Effect */}
                        <div className={`absolute w-8 h-8 -top-2 -left-2 rounded-full opacity-40 animate-ping ${marker.color || 'bg-blue-500'}`}></div>

                        {/* Pin */}
                        <div className={`relative w-4 h-4 rounded-full border-2 border-white shadow-lg ${marker.color || 'bg-blue-500'}`}></div>

                        {/* Tooltip */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/90 text-white text-xs p-2 rounded whitespace-nowrap opacity-0 group-hover/marker:opacity-100 transition-opacity pointer-events-none border border-white/20">
                            <strong>{marker.label}</strong>
                            {marker.sub && <div className="text-[10px] text-gray-400">{marker.sub}</div>}
                        </div>
                    </div>
                ))}

                {/* 5. Compass & Controls */}
                <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                    <div className="w-8 h-8 bg-white/10 backdrop-blur rounded flex items-center justify-center hover:bg-white/20 cursor-pointer text-white text-lg">+</div>
                    <div className="w-8 h-8 bg-white/10 backdrop-blur rounded flex items-center justify-center hover:bg-white/20 cursor-pointer text-white text-lg">-</div>
                </div>
                <div className="absolute bottom-4 left-4 w-10 h-10 border-2 border-white/30 rounded-full flex items-center justify-center">
                    <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[12px] border-b-red-500 transform rotate-45"></div>
                </div>
            </div>

            {/* Style for animations */}
            <style>{`
                @keyframes dash {
                    to {
                        stroke-dashoffset: -20;
                    }
                }
                .animate-dash {
                    animation: dash 1s linear infinite;
                }
            `}</style>
        </div>
    );
}
