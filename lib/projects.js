export const projects = [
  {
    slug: "cli-greeting",
    title: "CLI Greeting",
    description:
      "A command line tool that takes your name as input and prints a greeting. Built with Node.js.",
    longDescription:
      "This was my first Node.js script — a CLI tool that accepts a name as a command-line argument and prints a personalised greeting to the terminal. Simple as it sounds, it introduced me to how Node.js reads process.argv, how to handle missing or extra arguments gracefully, and how to structure a script so it's actually runnable from the command line. It solved the problem of getting comfortable with the Node runtime before moving on to anything more complex, and it taught me that even a ten-line script has decisions worth thinking about: what happens if no name is passed? What if someone passes multiple words?",
    tags: ["Node.js", "CLI"],
    githubUrl:
      "https://github.com/sanjay-creativelements/week-1-exercises/tree/main/script1",
  },
  {
    slug: "prime-number-checker",
    title: "Prime Number Checker",
    description:
      "A CLI tool that checks if a number is prime with input validation and edge case handling.",
    longDescription:
      "A CLI tool that takes a number as input and tells you whether it's prime. The interesting part wasn't the maths — it was everything around it. I had to handle cases where the input isn't a number at all, where it's negative, where it's zero or one (neither of which are prime), and where someone passes nothing. That meant learning how to validate and coerce command-line arguments before doing any real logic. For the primality check itself I used trial division up to the square root of the number, which is efficient enough for any input a human would reasonably type. Building this made me think carefully about what 'correct' really means — a function that crashes on bad input isn't correct, even if it gets the right answer on good input.",
    tags: ["Node.js", "CLI", "Logic"],
    githubUrl:
      "https://github.com/sanjay-creativelements/week-1-exercises/tree/main/script2",
  },
  {
    slug: "json-transformer",
    title: "JSON Transformer",
    description:
      "Reads a JSON file, filters adults, adds pass/fail grades, and writes output to a new file.",
    longDescription:
      "This project introduced me to Node's built-in fs module for reading and writing files. The script loads a JSON file containing a list of people with ages and scores, filters out anyone under 18, adds a pass or fail grade based on their score, and writes the transformed result to a new output file. It sounds mechanical, but it forced me to think about data pipelines: read → parse → transform → serialise → write. I also had to handle errors at each stage — what if the file doesn't exist? What if the JSON is malformed? What if the scores are missing? Each of those failure modes needed a clear, informative error message rather than a silent crash. This was my first real taste of working with structured data programmatically.",
    tags: ["Node.js", "File I/O", "JSON"],
    githubUrl:
      "https://github.com/sanjay-creativelements/week-1-exercises/tree/main/script3",
  },
  {
    slug: "async-json-transformer",
    title: "Async JSON Transformer",
    description:
      "Same as above but rewritten using async/await to handle file operations asynchronously.",
    longDescription:
      "After completing the synchronous JSON Transformer, I rewrote it using async/await and the promise-based fs.promises API. The transformation logic stayed identical — filter adults, grade by score, write output — but the execution model changed completely. Instead of blocking the thread while waiting for disk I/O, the async version yields control and resumes when the file operation completes. This taught me why async matters: in a real application, a synchronous file read would freeze everything else while it waits. I also learned how to use try/catch with async functions to handle rejected promises cleanly, which feels much more natural than callback-style error handling. Rewriting something you've already built is a surprisingly effective way to understand what actually changed.",
    tags: ["Node.js", "Async", "JSON"],
    githubUrl:
      "https://github.com/sanjay-creativelements/week-1-exercises/tree/main/script4",
  },
  {
    slug: "cli-toc",
    title: "CLI Table of Contents Generator",
    description:
      "A CLI tool that scans a directory of markdown files and generates a table of contents showing the filename and first H1 heading. Outputs to terminal and saves as TOC.md.",
    longDescription:
      "This was the most complex project of the week. The tool scans a given directory, finds every .md file, reads each one to extract the first H1 heading using a regular expression, and builds a formatted table of contents. It then prints the result to the terminal and saves it as TOC.md in the same directory. I had to combine everything from the week: async file I/O, directory reading with fs.promises.readdir, argument handling for the target path, and regex for the heading extraction. The edge cases were interesting — what if a markdown file has no H1? What if the directory is empty? What if TOC.md already exists? Solving those made the tool actually robust rather than just a demo. This is the kind of utility I can picture using for real.",
    tags: ["Node.js", "CLI", "File I/O"],
    githubUrl:
      "https://github.com/sanjay-creativelements/week-1-exercises/tree/main/cli-toc",
  },
];
