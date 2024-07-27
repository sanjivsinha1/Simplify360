class Task {
    constructor(
        public id: string,
        public duration: number,
        public dependencies: string[]
    ) {}
}

class Workflow {
    tasks: Map<string, Task>;
    earliestStartTimes: Map<string, number>;
    earliestFinishTimes: Map<string, number>;
    latestFinishTimes: Map<string, number>;
    latestStartTimes: Map<string, number>;

    constructor(tasks: Task[]) {
        this.tasks = new Map(); // KEY - VALUE
        tasks.forEach(task => this.tasks.set(task.id, task));// { T_START, 'T_START', 0, [] }
        this.earliestStartTimes = new Map();
        this.earliestFinishTimes = new Map();
        this.latestFinishTimes = new Map();
        this.latestStartTimes = new Map();
    }

    private topologicalSort(): Task[] {
        const visited = new Set<string>();
        const stack: Task[] = [];
    
        const visit = (taskId: string) => {
            if (visited.has(taskId)) return;
            visited.add(taskId);
            const task = this.tasks.get(taskId);
            if (task) {
                task.dependencies.forEach(dep => visit(dep));
                stack.push(task);
            }
        };
    
        this.tasks.forEach((_, taskId) => visit(taskId));
        return stack;
    }
    

    calculateEarliestTimes() {
        const topoSortedTasks = this.topologicalSort();
        console.log("sorted", topoSortedTasks)    
        topoSortedTasks.forEach(task => {
            const est = task.dependencies.reduce((max, dep) => {
                return Math.max(max, this.earliestFinishTimes.get(dep) || 0);
            }, 0);
            this.earliestStartTimes.set(task.id, est);
            this.earliestFinishTimes.set(task.id, est + task.duration);
        });
    }
    

    calculateLatestTimes() {
        const topoSortedTasks = this.topologicalSort();
        const allTasks = Array.from(this.tasks.values());
        const maxEFT = Math.max(...Array.from(this.earliestFinishTimes.values()));
    
        allTasks.forEach(task => {
            this.latestFinishTimes.set(task.id, maxEFT);
        });
    
        const reversedTasks = [...topoSortedTasks].reverse();
    
        reversedTasks.forEach(task => {
            const lft = task.dependencies.reduce((min, dep) => {
                return Math.min(min, this.latestStartTimes.get(dep) || maxEFT);
            }, maxEFT);
            this.latestFinishTimes.set(task.id, lft);
            this.latestStartTimes.set(task.id, lft - task.duration);
        });
    }
    

    getEarliestCompletionTime(): number {
        return Math.max(...Array.from(this.earliestFinishTimes.values()));
    }
    
    getLatestCompletionTime(): number {
        return Math.max(...Array.from(this.latestFinishTimes.values()));
    }
    
}

// Example usage:

const tasks = [
    new Task('T_START', 0, []),
    new Task('A', 3, ['T_START']),
    new Task('B', 2, ['A']),
    new Task('C', 1, ['A']),
    new Task('D', 4, ['B', 'C'])
];

const workflow = new Workflow(tasks);
workflow.calculateEarliestTimes();
workflow.calculateLatestTimes();

console.log('Earliest completion time:', workflow.getEarliestCompletionTime());
console.log('Latest completion time:', workflow.getLatestCompletionTime());
