from __future__ import annotations

from dataclasses import dataclass
from typing import Dict


@dataclass
class BehavioralSignals:
    consistency: float
    initiative: float
    adaptability: float
    leadership: float
    project_diversity: float
    collaboration: float
    learning_speed: float

    @property
    def growth_potential(self) -> float:
        return round(
            (
                self.initiative * 0.2
                + self.adaptability * 0.2
                + self.learning_speed * 0.2
                + self.project_diversity * 0.15
                + self.collaboration * 0.15
                + self.leadership * 0.1
            ),
            3,
        )


def compute_behavioral_signals(raw: Dict[str, float]) -> BehavioralSignals:
    return BehavioralSignals(
        consistency=raw.get("consistency", 0.6),
        initiative=raw.get("initiative", 0.6),
        adaptability=raw.get("adaptability", 0.6),
        leadership=raw.get("leadership", 0.6),
        project_diversity=raw.get("project_diversity", 0.6),
        collaboration=raw.get("collaboration", 0.6),
        learning_speed=raw.get("learning_speed", 0.6),
    )
