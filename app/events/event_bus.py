from typing import Callable, Dict, List, Any
import asyncio

class EventBus:
    def __init__(self):
        self.subscribers: Dict[str, List[Callable]] = {}

    def subscribe(self, event_type: str, callback: Callable):
        if event_type not in self.subscribers:
            self.subscribers[event_type] = []
        self.subscribers[event_type].append(callback)
        print(f"Subscribed to {event_type}")

    async def publish(self, event_type: str, data: Any):
        """
        Publishes an event to all subscribers.
        Examples: product_created, order_confirmed, inventory_changed.
        """
        if event_type in self.subscribers:
            tasks = [callback(data) for callback in self.subscribers[event_type]]
            await asyncio.gather(*tasks)
            print(f"Published event {event_type} to {len(tasks)} subscribers")

# Global event bus instance
event_bus = EventBus()

# Example listener registration
async def on_order_created(data):
    print(f"Event Received: order_created -> Updating Analytics and Models for {data.get('order_id')}")

event_bus.subscribe("order_created", on_order_created)
