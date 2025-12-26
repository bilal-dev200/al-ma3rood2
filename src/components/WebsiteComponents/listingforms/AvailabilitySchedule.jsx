"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Copy, Clock } from "lucide-react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const DEFAULT_SLOT = { start: "06:00 AM", end: "07:00 PM" };

// Generate time options for the datalist (every 30 minutes)
const TIME_OPTIONS = (() => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
        for (let min = 0; min < 60; min += 30) {
            const h = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
            const ampm = hour < 12 ? "AM" : "PM";
            const m = min.toString().padStart(2, "0");
            options.push(`${h.toString().padStart(2, "0")}:${m} ${ampm}`);
        }
    }
    return options;
})();

export default function AvailabilitySchedule({ value, onChange }) {
    const [schedule, setSchedule] = useState(
        value ||
        DAYS.reduce((acc, day) => {
            acc[day] = [{ ...DEFAULT_SLOT, enabled: true }];
            return acc;
        }, {})
    );

    useEffect(() => {
        if (value && JSON.stringify(value) !== JSON.stringify(schedule)) {
            setSchedule(value);
        }
    }, [value]);

    const updateSchedule = (newSchedule) => {
        setSchedule(newSchedule);
        if (onChange) {
            onChange(newSchedule);
        }
    };

    const toggleDay = (day) => {
        const newSchedule = { ...schedule };
        if (newSchedule[day] && newSchedule[day].length > 0) {
            // If day is already enabled, we toggle enabled flag on first slot or clear slots
            // To match the UI checkbox behavior
            const isCurrentlyEnabled = newSchedule[day].some((s) => s.enabled !== false);
            newSchedule[day] = newSchedule[day].map((slot) => ({
                ...slot,
                enabled: !isCurrentlyEnabled,
            }));
        } else {
            newSchedule[day] = [{ ...DEFAULT_SLOT, enabled: true }];
        }
        updateSchedule(newSchedule);
    };

    const addSlot = (day) => {
        const newSchedule = { ...schedule };
        newSchedule[day] = [...(newSchedule[day] || []), { ...DEFAULT_SLOT, enabled: true }];
        updateSchedule(newSchedule);
    };

    const removeSlot = (day, index) => {
        const newSchedule = { ...schedule };
        newSchedule[day] = newSchedule[day].filter((_, i) => i !== index);
        // If no slots left, we keep the array but could mark day as disabled
        updateSchedule(newSchedule);
    };

    const updateSlot = (day, index, field, val) => {
        const newSchedule = { ...schedule };
        newSchedule[day] = newSchedule[day].map((slot, i) =>
            i === index ? { ...slot, [field]: val } : slot
        );
        updateSchedule(newSchedule);
    };

    const copyToAll = (sourceDay) => {
        const sourceSlots = schedule[sourceDay];
        const newSchedule = DAYS.reduce((acc, day) => {
            acc[day] = sourceSlots.map((slot) => ({ ...slot }));
            return acc;
        }, {});
        updateSchedule(newSchedule);
    };

    return (
        <div className="space-y-6">
            <datalist id="time-options">
                {TIME_OPTIONS.map((time) => (
                    <option key={time} value={time} />
                ))}
            </datalist>

            {DAYS.map((day) => {
                const slots = schedule[day] || [];
                const isEnabled = slots.some((s) => s.enabled !== false);

                return (
                    <div key={day} className="flex flex-col gap-4 border-b border-slate-100 pb-6 last:border-0">
                        <div className="flex items-start gap-4">
                            <div className="flex items-center gap-3 min-w-[80px] pt-2">
                                <input
                                    type="checkbox"
                                    checked={isEnabled}
                                    onChange={() => toggleDay(day)}
                                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                />
                                <span className={`text-sm font-medium ${isEnabled ? "text-slate-900" : "text-slate-400"}`}>
                                    {day}
                                </span>
                            </div>

                            <div className="flex-1 space-y-3">
                                {isEnabled ? (
                                    slots.map((slot, index) => (
                                        <div key={index} className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
                                            <div className="grid grid-cols-2 gap-4 flex-1">
                                                <div>
                                                    <label className="block text-[10px] uppercase tracking-wider text-slate-500 mb-1 font-semibold">
                                                        Start Time
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            list="time-options"
                                                            value={slot.start}
                                                            onChange={(e) => updateSlot(day, index, "start", e.target.value)}
                                                            placeholder="06:00 AM"
                                                            className="w-full rounded-xl border border-slate-200 pl-3 pr-10 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-sm transition-all"
                                                        />
                                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                                                            <Clock size={14} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] uppercase tracking-wider text-slate-500 mb-1 font-semibold">
                                                        End Time
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            list="time-options"
                                                            value={slot.end}
                                                            onChange={(e) => updateSlot(day, index, "end", e.target.value)}
                                                            placeholder="07:00 PM"
                                                            className="w-full rounded-xl border border-slate-200 pl-3 pr-10 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-sm transition-all"
                                                        />
                                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                                                            <Clock size={14} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 pt-5">
                                                <button
                                                    type="button"
                                                    onClick={() => addSlot(day)}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Add Slot"
                                                >
                                                    <Plus size={18} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => removeSlot(day, index)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Remove Slot"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                                {index === 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => copyToAll(day)}
                                                        className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                                                        title="Copy to all days"
                                                    >
                                                        <Copy size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-2">
                                        <span className="text-sm text-slate-400 italic">Unavailable</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
