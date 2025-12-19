# ROS 2 Action Sequences for Voice Commands

This document outlines example ROS 2 action sequences that correspond to voice commands processed through our Whisper integration system.

## Navigation Actions

### Forward Movement
```python
# Action sequence: navigate_to_target
def execute_move_forward(robot):
    """Execute forward movement based on voice command"""
    twist_msg = Twist()
    twist_msg.linear.x = 0.3  # Move forward at 0.3 m/s
    cmd_vel_publisher.publish(twist_msg)
    robot.get_logger().info("Moving forward as commanded")
```

### Turn Left/Right
```python
# Action sequence: adjust_position
def execute_turn(robot, direction="left", angle=90):
    """Execute turning action based on voice command"""
    angular_velocity = 0.5  # rad/s
    duration = math.radians(angle) / angular_velocity

    twist_msg = Twist()
    if direction == "left":
        twist_msg.angular.z = angular_velocity
    else:  # right
        twist_msg.angular.z = -angular_velocity

    # Turn for calculated duration
    start_time = robot.get_clock().now()
    while (robot.get_clock().now() - start_time).nanoseconds < duration * 1e9:
        cmd_vel_publisher.publish(twist_msg)
        time.sleep(0.1)

    # Stop robot
    stop_robot(robot)
```

## Manipulation Actions

### Grasping Objects
```python
# Action sequence: approach_object, activate_gripper, secure_object
class GripperController:
    def __init__(self):
        self.gripper_client = actionlib.SimpleActionClient('gripper_controller/gripper_action', GripperCommandAction)

    def grasp_object(self, object_info):
        """Execute grasping sequence for identified object"""
        # Approach the object
        self.approach_object(object_info['position'])

        # Prepare gripper command
        gripper_goal = GripperCommandGoal()
        gripper_goal.command.position = 0.0  # Closed position
        gripper_goal.command.max_effort = 100.0

        # Send goal and wait for result
        self.gripper_client.send_goal_and_wait(gripper_goal)
        return self.gripper_client.get_result()

    def approach_object(self, position):
        """Navigate to object position"""
        navigation_client = ActionClient('navigate_to_pose', NavigateToPose)
        goal = NavigateToPose.Goal()
        goal.pose = self.create_pose(position)
        navigation_client.send_goal(goal)
```

### Placing Objects
```python
# Action sequence: navigate_to_destination, release_object, position_item
def execute_place_object(robot, destination):
    """Execute placing sequence for object in gripper"""
    # Navigate to destination
    navigation_client.go_to(destination)

    # Wait for arrival
    if navigation_client.wait_for_result():
        # Release object
        gripper_controller.open_gripper()
        robot.get_logger().info(f"Object placed at {destination}")
```

## Complex Action Sequences

### Multi-step Navigation
```python
# Action sequence for "Go to the kitchen and wait by the counter"
async def execute_complex_navigation(robot):
    """Execute multi-step navigation sequence"""
    # Step 1: Navigate to kitchen
    kitchen_location = get_location("kitchen")
    result = await navigate_to(kitchen_location)

    if result.success:
        # Step 2: Navigate to counter area
        counter_location = get_location("counter_area", relative_to=kitchen_location)
        result = await navigate_to(counter_location)

        if result.success:
            # Step 3: Position relative to counter
            await position_relative_to_surface(counter_location, distance=0.5)
            robot.get_logger().info("Reached destination and positioned appropriately")
```

### Object Interaction Sequence
```python
# Action sequence for "Pick up the red cup and bring it to me"
async def execute_fetch_task(robot):
    """Execute fetch task with object recognition and navigation"""
    # Step 1: Locate the red cup
    object_finder = ObjectFinder(robot)
    target_object = await object_finder.find_object(color="red", category="cup")

    if target_object:
        # Step 2: Navigate to object
        await robot.nav_client.go_to(target_object.position)

        # Step 3: Grasp the object
        gripper_result = await robot.gripper.grasp(target_object)

        if gripper_result.success:
            # Step 4: Navigate back to user
            user_position = await robot.locate_user()
            await robot.nav_client.go_to(user_position)

            # Step 5: Deliver object
            await robot.gripper.release()
            robot.get_logger().info("Object delivered successfully")
```

## Voice Command Mapping

The following table shows how voice commands map to action sequences:

| Voice Command | Primary Intent | Action Sequence |
|---------------|----------------|-----------------|
| "Move forward" | move | navigate_to_target |
| "Turn left/right" | move | adjust_position |
| "Pick up the [object]" | grasp | approach_object → activate_gripper → secure_object |
| "Place [object] on [surface]" | place | navigate_to_destination → release_object → position_item |
| "Go to [location]" | move | navigate_to_target |
| "Stop" | stop | halt_motors → freeze_position → cease_movement |

## Error Handling and Validation

Each action sequence includes error handling:

```python
async def safe_execute_action(robot, action_sequence, timeout=30.0):
    """Safely execute an action sequence with timeout and error handling"""
    try:
        # Validate action sequence
        if not validate_action_sequence(action_sequence):
            robot.get_logger().error("Invalid action sequence")
            return False

        # Execute with timeout
        start_time = time.time()
        result = await action_sequence.execute()

        if time.time() - start_time > timeout:
            robot.get_logger().error("Action sequence timed out")
            await emergency_stop(robot)
            return False

        return result.success

    except Exception as e:
        robot.get_logger().error(f"Action sequence failed: {e}")
        await emergency_stop(robot)
        return False

def validate_action_sequence(sequence):
    """Validate that the action sequence is safe to execute"""
    # Check for collisions
    if sequence.would_cause_collision():
        return False

    # Check for safety limits
    if sequence.exceeds_joint_limits():
        return False

    # Check for environment constraints
    if sequence.violates_workspace_bounds():
        return False

    return True
```

## Integration with Whisper Processing

The action sequences are integrated with the Whisper processing pipeline:

```python
# In the voice processing service
def generate_action_commands(self, intent_data: Dict) -> List[str]:
    """
    Generate specific action commands based on detected intent
    Maps intents to ROS 2 action sequences
    """
    intent = intent_data["intent"]
    raw_text = intent_data["raw_text"]

    # Map intents to specific action sequences
    if intent == "move":
        if "forward" in raw_text:
            return ["navigate_to_target(linear_x=0.3)"]
        elif "backward" in raw_text:
            return ["navigate_to_target(linear_x=-0.3)"]
        elif "left" in raw_text:
            return ["adjust_position(direction='left', angle=90)"]
        elif "right" in raw_text:
            return ["adjust_position(direction='right', angle=90)"]

    elif intent == "grasp":
        # Extract object information from raw text
        object_info = self.extract_object_info(raw_text)
        return [
            f"approach_object('{object_info}')",
            "activate_gripper()",
            "secure_object()"
        ]

    elif intent == "place":
        # Extract destination from raw text
        destination = self.extract_destination(raw_text)
        return [
            f"navigate_to_destination('{destination}')",
            "release_object()",
            "position_item()"
        ]

    # Default action mapping
    action_mapping = {
        "move": ["navigate_to_target", "adjust_position", "change_location"],
        "grasp": ["approach_object", "activate_gripper", "secure_object"],
        "place": ["navigate_to_destination", "release_object", "position_item"],
        "stop": ["halt_motors", "freeze_position", "cease_movement"],
        "find": ["scan_environment", "identify_target", "focus_on_object"],
        "follow": ["track_target", "maintain_distance", "adjust_path"]
    }

    return action_mapping.get(intent, ["standby"])
```

These action sequences provide a framework for translating voice commands processed by Whisper into concrete ROS 2 robot actions, ensuring safe and reliable operation.