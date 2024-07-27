class SocialNetwork {
    private friendsMap: Map<string, Set<string>>;

    constructor() {
        this.friendsMap = new Map();
    }

    // Add a friend relationship
    addFriend(person1: string, person2: string) {
        if (!this.friendsMap.has(person1)) {
            this.friendsMap.set(person1, new Set());
        }
        if (!this.friendsMap.has(person2)) {
            this.friendsMap.set(person2, new Set());
        }
        this.friendsMap.get(person1)?.add(person2);
        this.friendsMap.get(person2)?.add(person1);
    }

    // Find all friends of a person
    getFriends(person: string): Set<string> {
        return this.friendsMap.get(person) || new Set();
    }

    // Find common friends between two people
    findCommonFriends(person1: string, person2: string): Set<string> {
        const friends1 = this.getFriends(person1);
        const friends2 = this.getFriends(person2);
        return new Set([...friends1].filter(friend => friends2.has(friend)));
    }

    // Find nth connection between two people using BFS
    findNthConnection(start: string, end: string): number {
        if (start === end) return 0;

        const visited = new Set<string>();
        const queue: [string, number][] = [[start, 0]]; // Tuple of (current person, depth)

        while (queue.length > 0) {
            const [current, depth] = queue.shift()!;
            
            if (current === end) return depth;

            visited.add(current);

            const friends = this.getFriends(current);
            for (const friend of friends) {
                if (!visited.has(friend)) {
                    queue.push([friend, depth + 1]);
                    visited.add(friend);
                }
            }
        }

        return -1; // No connection found
    }
}

// Example usage
const network = new SocialNetwork();

// Adding friends
network.addFriend("Alice", "Bob");
network.addFriend("Bob", "Janice");
network.addFriend("Alice", "Charlie");
network.addFriend("Charlie", "Janice");

// Finding friends
console.log("Friends of Alice:", Array.from(network.getFriends("Alice")));
console.log("Friends of Bob:", Array.from(network.getFriends("Bob")));

// Finding common friends
console.log("Common friends between Alice and Bob:", Array.from(network.findCommonFriends("Alice", "Bob")));

// Finding nth connection
console.log("Nth connection between Alice and Janice:", network.findNthConnection("Alice", "Janice"));
console.log("Nth connection between Alice and Bob:", network.findNthConnection("Alice", "Bob"));
console.log("Nth connection between Alice and Charlie:", network.findNthConnection("Alice", "Charlie"));
