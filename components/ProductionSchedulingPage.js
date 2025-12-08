function ProductionSchedulingPage() {
    return (
        <div className="animate-circular-reveal" data-name="production-scheduling-page">
            <h1 className="text-3xl font-bold mb-2">Production Scheduling</h1>
            <p className="text-[var(--text-secondary)] mb-6"> Optimize milling operations and resource allocation</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="card border-l-4 border-l-blue-500">
                    <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-1">Crushing Capacity</h3>
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold">85%</span>
                        <span className="text-sm text-green-600 mb-1">↑ 5%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2 dark:bg-gray-700">
                        <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                </div>
                <div className="card border-l-4 border-l-amber-500">
                    <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-1">Planned Maintenance</h3>
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold">2 Days</span>
                        <span className="text-sm text-[var(--text-secondary)] mb-1">Unit B</span>
                    </div>
                    <p className="text-xs text-amber-600 mt-2">Scheduled for next weekend</p>
                </div>
                <div className="card border-l-4 border-l-green-500">
                    <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-1">Oil Output Target</h3>
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold">120 MT</span>
                        <span className="text-sm text-green-600 mb-1">On Track</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2 dark:bg-gray-700">
                        <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 card">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold">Weekly Production Plan</h3>
                        <div className="flex gap-2">
                            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg font-medium">Shift A</span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg font-medium">Shift B</span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {[
                            { day: 'Monday', task: 'Soybean Crushing', status: 'Completed', progress: 100 },
                            { day: 'Tuesday', task: 'Soybean Crushing', status: 'In Progress', progress: 65 },
                            { day: 'Wednesday', task: 'Refining Batch #402', status: 'Scheduled', progress: 0 },
                            { day: 'Thursday', task: 'Packaging 5L Cans', status: 'Scheduled', progress: 0 },
                            { day: 'Friday', task: 'Maintenance Check', status: 'Scheduled', progress: 0 },
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 p-3 bg-[var(--bg-light)] rounded-lg">
                                <div className="w-24 font-medium text-sm">{item.day}</div>
                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium">{item.task}</span>
                                        <span className="text-xs text-[var(--text-secondary)]">{item.status}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                                        <div
                                            className={`h-2 rounded-full ${item.status === 'Completed' ? 'bg-green-500' : item.status === 'In Progress' ? 'bg-blue-500' : 'bg-gray-400'}`}
                                            style={{ width: `${item.progress === 0 ? 5 : item.progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card">
                    <h3 className="text-lg font-semibold mb-4">Raw Material Needs</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border border-[var(--border-color)] rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-700 font-bold">S</div>
                                <div>
                                    <p className="font-medium">Soybean Seeds</p>
                                    <p className="text-xs text-[var(--text-secondary)]">Required: 50 MT</p>
                                </div>
                            </div>
                            <span className="text-red-500 text-sm font-medium">Critical</span>
                        </div>
                        <div className="flex items-center justify-between p-3 border border-[var(--border-color)] rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 font-bold">M</div>
                                <div>
                                    <p className="font-medium">Mustard Seeds</p>
                                    <p className="text-xs text-[var(--text-secondary)]">Required: 25 MT</p>
                                </div>
                            </div>
                            <span className="text-green-500 text-sm font-medium">Stocked</span>
                        </div>
                        <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
                            <button className="btn-primary w-full text-sm">Create Procurement Request</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
