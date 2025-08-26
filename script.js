// Copy code functionality
function copyCode(button) {
    const codeBlock = button.nextElementSibling.querySelector('code');
    const text = codeBlock.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
        const originalText = button.textContent;
        const originalLabel = button.getAttribute('aria-label');
        button.textContent = 'Copied!';
        button.setAttribute('aria-label', 'Code copied to clipboard');
        button.classList.add('copied');
        
        setTimeout(() => {
            button.textContent = originalText;
            button.setAttribute('aria-label', originalLabel);
            button.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        const originalText = button.textContent;
        const originalLabel = button.getAttribute('aria-label');
        button.textContent = 'Copied!';
        button.setAttribute('aria-label', 'Code copied to clipboard');
        button.classList.add('copied');
        
        setTimeout(() => {
            button.textContent = originalText;
            button.setAttribute('aria-label', originalLabel);
            button.classList.remove('copied');
        }, 2000);
    });
}

// Enhanced smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.sidebar a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerOffset = 80;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Active section highlighting
    const sections = document.querySelectorAll('.recipe-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.3 });
    
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Syntax highlighting completely disabled to prevent HTML corruption
    // highlightSyntax();
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    const themeToggle = document.getElementById('themeToggle');
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeToggle) {
            themeToggle.textContent = '☀️';
            themeToggle.setAttribute('aria-label', 'Switch to light mode');
        }
    }
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Escape key closes mobile menu
        if (e.key === 'Escape') {
            const sidebar = document.querySelector('.sidebar');
            const toggle = document.querySelector('.mobile-menu-toggle');
            if (sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                toggle.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = 'auto';
            }
        }
    });
});

// Enhanced syntax highlighting function - DISABLED
function highlightSyntax() {
    return; // Disabled to prevent HTML corruption
    const codeBlocks = document.querySelectorAll('code.c');
    
    codeBlocks.forEach(block => {
        let html = block.textContent;
        
        // Escape HTML first
        html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        
        // Keywords
        const keywords = ['include', 'define', 'int', 'char', 'void', 'struct', 'if', 'else', 'while', 'for', 'do', 'switch', 'case', 'break', 'return', 'sizeof', 'malloc', 'free', 'printf', 'scanf', 'NULL', 'main'];
        keywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'g');
            html = html.replace(regex, `<span class="keyword">${keyword}</span>`);
        });
        
        // Preprocessor directives
        html = html.replace(/#(\w+)/g, '<span class="preprocessor">#$1</span>');
        
        // Strings
        html = html.replace(/"([^"]*)"/g, '<span class="string">"$1"</span>');
        
        // Comments
        html = html.replace(/\/\*[\s\S]*?\*\//g, '<span class="comment">$&</span>');
        html = html.replace(/\/\/.*$/gm, '<span class="comment">$&</span>');
        
        // Numbers
        html = html.replace(/\b(\d+)\b/g, '<span class="number">$1</span>');
        
        // Operators
        html = html.replace(/([+\-*/%=<>!&|]+)/g, '<span class="operator">$1</span>');
        
        // Brackets and semicolons
        html = html.replace(/([{}\[\]()])/g, '<span class="bracket">$1</span>');
        html = html.replace(/(;)/g, '<span class="semicolon">$1</span>');
        
        block.innerHTML = html;
    });
}

// Mobile menu toggle
function toggleMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    const toggle = document.querySelector('.mobile-menu-toggle');
    
    sidebar.classList.toggle('active');
    toggle.classList.toggle('active');
    
    // Update ARIA attributes
    const isExpanded = sidebar.classList.contains('active');
    toggle.setAttribute('aria-expanded', isExpanded);
    
    // Prevent body scroll when menu is open
    if (isExpanded) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

// Close mobile menu when clicking on a link
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.sidebar a');
    const sidebar = document.querySelector('.sidebar');
    const toggle = document.querySelector('.mobile-menu-toggle');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
                toggle.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && 
            !sidebar.contains(e.target) && 
            !toggle.contains(e.target) && 
            sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
            toggle.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('active');
            toggle.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});

// Back to Top Button
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('scroll', function() {
    const backToTop = document.getElementById('backToTop');
    const scrollToBottom = document.getElementById('scrollToBottom');
    const scrollPosition = window.pageYOffset;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    if (scrollPosition > 300) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
    
    if (scrollPosition < documentHeight - 300) {
        scrollToBottom.classList.remove('hide');
    } else {
        scrollToBottom.classList.add('hide');
    }
});

// Scroll to Bottom Button
function scrollToBottom() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

// Search functionality
function searchRecipes() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const recipes = document.querySelectorAll('.recipe-card');
    const navLinks = document.querySelectorAll('.sidebar a');
    
    recipes.forEach((recipe, index) => {
        const title = recipe.querySelector('h2').textContent.toLowerCase();
        const content = recipe.textContent.toLowerCase();
        
        if (title.includes(searchTerm) || content.includes(searchTerm)) {
            recipe.classList.remove('hidden');
            navLinks[index].style.display = 'block';
        } else {
            recipe.classList.add('hidden');
            navLinks[index].style.display = 'none';
        }
    });
}

// Theme toggle functionality
function toggleTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');
    
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
        themeToggle.textContent = '☀️';
        themeToggle.setAttribute('aria-label', 'Switch to light mode');
        localStorage.setItem('theme', 'dark');
    } else {
        themeToggle.textContent = '🌙';
        themeToggle.setAttribute('aria-label', 'Switch to dark mode');
        localStorage.setItem('theme', 'light');
    }
}

// Hide loader after page loads and show mobile notification
window.addEventListener('load', function() {
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
        
        // Show mobile notification for small devices - always show for testing
        if (window.innerWidth <= 768) {
            setTimeout(() => {
                document.getElementById('mobileNotification').classList.add('show');
            }, 1000);
        }
    }, 1500);
});

// Also check on resize
window.addEventListener('resize', function() {
    if (window.innerWidth <= 768 && !document.getElementById('mobileNotification').classList.contains('show')) {
        setTimeout(() => {
            document.getElementById('mobileNotification').classList.add('show');
        }, 500);
    }
});

// Dismiss mobile notification
function dismissNotification() {
    document.getElementById('mobileNotification').classList.remove('show');
    localStorage.setItem('mobileNotificationDismissed', 'true');
}

// Update breadcrumb based on active section
function updateBreadcrumb() {
    const sections = document.querySelectorAll('.recipe-card');
    const breadcrumb = document.getElementById('currentSection');
    
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
            const title = section.querySelector('h2').textContent;
            breadcrumb.textContent = title.replace('Recipe ', '').replace(/^\d+: /, '');
        }
    });
}

window.addEventListener('scroll', updateBreadcrumb);

// PDF Download functionality
function downloadPDF() {
    window.print();
}

// Interactive Stack Visualization
let visualStack = [];
const MAX_STACK_SIZE = 5;

function visualPush() {
    const input = document.getElementById('pushValue');
    const value = parseInt(input.value);
    
    if (!value || value < 1 || value > 99) {
        updateStackInfo('Please enter a valid number (1-99)');
        return;
    }
    
    if (visualStack.length >= MAX_STACK_SIZE) {
        updateStackInfo('Stack Overflow! Cannot push more elements');
        return;
    }
    
    visualStack.push(value);
    renderStack();
    updateStackInfo(`Pushed ${value}. Stack size: ${visualStack.length}`);
    input.value = '';
}

function visualPop() {
    if (visualStack.length === 0) {
        updateStackInfo('Stack Underflow! Nothing to pop');
        return;
    }
    
    const poppedValue = visualStack.pop();
    renderStack();
    updateStackInfo(`Popped ${poppedValue}. Stack size: ${visualStack.length}`);
}

function resetStack() {
    visualStack = [];
    renderStack();
    updateStackInfo('Stack reset - now empty');
}

function renderStack() {
    const container = document.getElementById('stackElements');
    const base = container.querySelector('.stack-base');
    
    // Remove all stack elements except base
    const elements = container.querySelectorAll('.stack-element');
    elements.forEach(el => el.remove());
    
    // Add current stack elements
    visualStack.forEach(value => {
        const element = document.createElement('div');
        element.className = 'stack-element';
        element.textContent = value;
        container.appendChild(element);
    });
}

function updateStackInfo(message) {
    const info = document.getElementById('stackInfo');
    info.textContent = message;
    
    // Reset to default after 3 seconds
    setTimeout(() => {
        if (visualStack.length === 0) {
            info.textContent = 'Stack is empty';
        } else {
            info.textContent = `Stack has ${visualStack.length} element(s). Top: ${visualStack[visualStack.length - 1]}`;
        }
    }, 3000);
}

// Queue Visualization
let visualQueue = [];
const MAX_QUEUE_SIZE = 5;

function visualEnqueue() {
    const input = document.getElementById('enqueueValue');
    const value = parseInt(input.value);
    
    if (!value || value < 1 || value > 99) {
        updateQueueInfo('Please enter a valid number (1-99)');
        return;
    }
    
    if (visualQueue.length >= MAX_QUEUE_SIZE) {
        updateQueueInfo('Queue Overflow! Cannot enqueue more elements');
        return;
    }
    
    visualQueue.push(value);
    renderQueue();
    updateQueueInfo(`Enqueued ${value}. Queue size: ${visualQueue.length}`);
    input.value = '';
}

function visualDequeue() {
    if (visualQueue.length === 0) {
        updateQueueInfo('Queue Underflow! Nothing to dequeue');
        return;
    }
    
    const dequeuedValue = visualQueue.shift();
    renderQueue();
    updateQueueInfo(`Dequeued ${dequeuedValue}. Queue size: ${visualQueue.length}`);
}

function resetQueue() {
    visualQueue = [];
    renderQueue();
    updateQueueInfo('Queue reset - now empty');
}

function renderQueue() {
    const container = document.getElementById('queueElements');
    const labels = container.querySelectorAll('.queue-label');
    
    // Remove all queue elements except labels
    const elements = container.querySelectorAll('.queue-element');
    elements.forEach(el => el.remove());
    
    // Add current queue elements
    visualQueue.forEach(value => {
        const element = document.createElement('div');
        element.className = 'queue-element';
        element.textContent = value;
        container.appendChild(element);
    });
}

function updateQueueInfo(message) {
    const info = document.getElementById('queueInfo');
    if (info) {
        info.textContent = message;
        
        setTimeout(() => {
            if (visualQueue.length === 0) {
                info.textContent = 'Queue is empty';
            } else {
                info.textContent = `Queue has ${visualQueue.length} element(s). Front: ${visualQueue[0]}, Rear: ${visualQueue[visualQueue.length - 1]}`;
            }
        }, 3000);
    }
}

// Linked List Visualization
let visualList = [];

function visualInsertBegin() {
    const input = document.getElementById('listValue');
    const value = parseInt(input.value);
    
    if (!value || value < 1 || value > 99) {
        updateListInfo('Please enter a valid number (1-99)');
        return;
    }
    
    visualList.unshift(value);
    renderList();
    updateListInfo(`Inserted ${value} at beginning. List size: ${visualList.length}`);
    input.value = '';
}

function visualInsertEnd() {
    const input = document.getElementById('listValue');
    const value = parseInt(input.value);
    
    if (!value || value < 1 || value > 99) {
        updateListInfo('Please enter a valid number (1-99)');
        return;
    }
    
    visualList.push(value);
    renderList();
    updateListInfo(`Inserted ${value} at end. List size: ${visualList.length}`);
    input.value = '';
}

function visualDelete() {
    const input = document.getElementById('listValue');
    const value = parseInt(input.value);
    
    if (!value || value < 1 || value > 99) {
        updateListInfo('Please enter a valid number (1-99)');
        return;
    }
    
    const index = visualList.indexOf(value);
    if (index === -1) {
        updateListInfo(`Value ${value} not found in list`);
        return;
    }
    
    visualList.splice(index, 1);
    renderList();
    updateListInfo(`Deleted ${value}. List size: ${visualList.length}`);
    input.value = '';
}

function resetList() {
    visualList = [];
    renderList();
    updateListInfo('List reset - now empty');
}

function renderList() {
    const container = document.getElementById('listElements');
    container.innerHTML = '';
    
    if (visualList.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'list-empty';
        empty.textContent = 'List is empty';
        container.appendChild(empty);
        return;
    }
    
    visualList.forEach((value, index) => {
        const node = document.createElement('div');
        node.className = 'list-node';
        
        const data = document.createElement('div');
        data.className = 'node-data';
        data.textContent = value;
        node.appendChild(data);
        
        if (index < visualList.length - 1) {
            const arrow = document.createElement('div');
            arrow.className = 'node-arrow';
            arrow.textContent = '→';
            node.appendChild(arrow);
        } else {
            const nullPointer = document.createElement('div');
            nullPointer.className = 'node-arrow';
            nullPointer.textContent = '→ NULL';
            nullPointer.style.color = 'var(--text-muted)';
            node.appendChild(nullPointer);
        }
        
        container.appendChild(node);
    });
}

function updateListInfo(message) {
    const info = document.getElementById('listInfo');
    if (info) {
        info.textContent = message;
        
        setTimeout(() => {
            if (visualList.length === 0) {
                info.textContent = 'List is empty';
            } else {
                info.textContent = `List has ${visualList.length} node(s). Head: ${visualList[0]}`;
            }
        }, 3000);
    }
}

// Initialize all visualizations
document.addEventListener('DOMContentLoaded', function() {
    // Stack input handler
    const pushInput = document.getElementById('pushValue');
    if (pushInput) {
        pushInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                visualPush();
            }
        });
    }
    
    // Queue input handler
    const enqueueInput = document.getElementById('enqueueValue');
    if (enqueueInput) {
        enqueueInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                visualEnqueue();
            }
        });
    }
    
    // List input handler
    const listInput = document.getElementById('listValue');
    if (listInput) {
        listInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                visualInsertEnd();
            }
        });
    }
    
    // Infix input handler
    const infixInput = document.getElementById('infixInput');
    if (infixInput) {
        infixInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                convertInfixToPostfix();
            }
        });
    }
    
    // Postfix input handler
    const postfixInput = document.getElementById('postfixInput');
    if (postfixInput) {
        postfixInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                evaluatePostfixExpression();
            }
        });
    }
    
    // Double list input handler
    const doubleListInput = document.getElementById('doubleListValue');
    if (doubleListInput) {
        doubleListInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                doubleInsertEnd();
            }
        });
    }
});

// Search Algorithms Visualization
let searchAnimation = false;

function startBinarySearch() {
    if (searchAnimation) return;
    
    const arrayInput = document.getElementById('binaryArray').value.trim();
    const target = parseInt(document.getElementById('binaryTarget').value);
    
    if (!arrayInput || !target) {
        document.getElementById('binaryInfo').textContent = 'Please enter both array and target value';
        return;
    }
    
    const array = arrayInput.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));
    
    if (array.length === 0) {
        document.getElementById('binaryInfo').textContent = 'Please enter a valid array';
        return;
    }
    
    searchAnimation = true;
    renderArray('binaryArrayDisplay', array);
    performBinarySearch(array, target);
}

function startInterpolationSearch() {
    if (searchAnimation) return;
    
    const arrayInput = document.getElementById('interpolationArray').value.trim();
    const target = parseInt(document.getElementById('interpolationTarget').value);
    
    if (!arrayInput || !target) {
        document.getElementById('interpolationInfo').textContent = 'Please enter both array and target value';
        return;
    }
    
    const array = arrayInput.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));
    
    if (array.length === 0) {
        document.getElementById('interpolationInfo').textContent = 'Please enter a valid array';
        return;
    }
    
    searchAnimation = true;
    renderArray('interpolationArrayDisplay', array);
    performInterpolationSearch(array, target);
}

function renderArray(containerId, array) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    array.forEach((value, index) => {
        const element = document.createElement('div');
        element.className = 'array-element';
        element.textContent = value;
        element.id = `${containerId}-${index}`;
        
        const indexLabel = document.createElement('div');
        indexLabel.className = 'element-index';
        indexLabel.textContent = index;
        element.appendChild(indexLabel);
        
        container.appendChild(element);
    });
}

function performBinarySearch(array, target) {
    const steps = [];
    let low = 0;
    let high = array.length - 1;
    let stepCount = 0;
    
    const searchStep = () => {
        if (low <= high) {
            const mid = Math.floor((low + high) / 2);
            stepCount++;
            
            clearHighlights('binaryArrayDisplay');
            highlightElement('binaryArrayDisplay', low, 'low');
            highlightElement('binaryArrayDisplay', high, 'high');
            highlightElement('binaryArrayDisplay', mid, 'current');
            
            steps.push(`Step ${stepCount}: low=${low}, high=${high}, mid=${mid}, array[${mid}]=${array[mid]}`);
            
            if (array[mid] === target) {
                steps.push(`Found! Target ${target} found at index ${mid}`);
                highlightElement('binaryArrayDisplay', mid, 'found');
                document.getElementById('binaryInfo').textContent = `Found ${target} at index ${mid} in ${stepCount} steps`;
                displaySearchSteps(steps);
                searchAnimation = false;
                return;
            } else if (array[mid] < target) {
                steps.push(`array[${mid}] < ${target}, search right half`);
                for (let i = low; i <= mid; i++) {
                    setTimeout(() => highlightElement('binaryArrayDisplay', i, 'eliminated'), 500);
                }
                low = mid + 1;
            } else {
                steps.push(`array[${mid}] > ${target}, search left half`);
                for (let i = mid; i <= high; i++) {
                    setTimeout(() => highlightElement('binaryArrayDisplay', i, 'eliminated'), 500);
                }
                high = mid - 1;
            }
            
            setTimeout(searchStep, 1500);
        } else {
            steps.push(`Not found! Target ${target} is not in the array`);
            document.getElementById('binaryInfo').textContent = `Target ${target} not found after ${stepCount} steps`;
            displaySearchSteps(steps);
            searchAnimation = false;
        }
    };
    
    setTimeout(searchStep, 500);
}

function performInterpolationSearch(array, target) {
    const steps = [];
    let low = 0;
    let high = array.length - 1;
    let stepCount = 0;
    
    const searchStep = () => {
        if (low <= high && target >= array[low] && target <= array[high]) {
            stepCount++;
            
            const pos = low + Math.floor(((target - array[low]) * (high - low)) / (array[high] - array[low]));
            
            clearHighlights('interpolationArrayDisplay');
            highlightElement('interpolationArrayDisplay', low, 'low');
            highlightElement('interpolationArrayDisplay', high, 'high');
            highlightElement('interpolationArrayDisplay', pos, 'current');
            
            steps.push(`Step ${stepCount}: low=${low}, high=${high}, pos=${pos}, array[${pos}]=${array[pos]}`);
            
            if (array[pos] === target) {
                steps.push(`Found! Target ${target} found at index ${pos}`);
                highlightElement('interpolationArrayDisplay', pos, 'found');
                document.getElementById('interpolationInfo').textContent = `Found ${target} at index ${pos} in ${stepCount} steps`;
                displaySearchSteps(steps);
                searchAnimation = false;
                return;
            } else if (array[pos] < target) {
                steps.push(`array[${pos}] < ${target}, search right half`);
                for (let i = low; i <= pos; i++) {
                    setTimeout(() => highlightElement('interpolationArrayDisplay', i, 'eliminated'), 500);
                }
                low = pos + 1;
            } else {
                steps.push(`array[${pos}] > ${target}, search left half`);
                for (let i = pos; i <= high; i++) {
                    setTimeout(() => highlightElement('interpolationArrayDisplay', i, 'eliminated'), 500);
                }
                high = pos - 1;
            }
            
            setTimeout(searchStep, 2000);
        } else {
            steps.push(`Not found! Target ${target} is not in the array`);
            document.getElementById('interpolationInfo').textContent = `Target ${target} not found after ${stepCount} steps`;
            displaySearchSteps(steps);
            searchAnimation = false;
        }
    };
    
    setTimeout(searchStep, 500);
}

function clearHighlights(containerId) {
    const elements = document.querySelectorAll(`#${containerId} .array-element`);
    elements.forEach(el => {
        el.className = 'array-element';
    });
}

function highlightElement(containerId, index, type) {
    const element = document.getElementById(`${containerId}-${index}`);
    if (element) {
        element.className = `array-element ${type}`;
    }
}

function displaySearchSteps(steps) {
    const container = document.getElementById('searchSteps');
    container.innerHTML = '<h4>Search Steps:</h4>';
    
    steps.forEach((step, index) => {
        const div = document.createElement('div');
        div.className = 'search-step';
        if (step.includes('Found!') || step.includes('Not found!')) {
            div.classList.add('highlight');
        }
        div.textContent = step;
        container.appendChild(div);
    });
}

// Infix to Postfix Conversion Visualization
function convertInfixToPostfix() {
    const input = document.getElementById('infixInput').value.trim().toUpperCase();
    if (!input) {
        alert('Please enter an infix expression');
        return;
    }
    
    const stack = [];
    let postfix = '';
    const steps = [];
    
    const precedence = { '+': 1, '-': 1, '*': 2, '/': 2, '^': 3 };
    const isOperator = (c) => '+-*/^'.includes(c);
    const isOperand = (c) => /[A-Z0-9]/.test(c);
    
    for (let i = 0; i < input.length; i++) {
        const char = input[i];
        
        if (isOperand(char)) {
            postfix += char;
            steps.push(`'${char}' is operand → add to output: ${postfix}`);
        } else if (char === '(') {
            stack.push(char);
            steps.push(`'${char}' → push to stack: [${stack.join(', ')}]`);
        } else if (char === ')') {
            while (stack.length && stack[stack.length - 1] !== '(') {
                postfix += stack.pop();
            }
            stack.pop(); // Remove '('
            steps.push(`')' → pop until '(': ${postfix}, stack: [${stack.join(', ')}]`);
        } else if (isOperator(char)) {
            while (stack.length && stack[stack.length - 1] !== '(' && 
                   precedence[stack[stack.length - 1]] >= precedence[char]) {
                postfix += stack.pop();
            }
            stack.push(char);
            steps.push(`'${char}' → pop higher precedence, push: [${stack.join(', ')}], output: ${postfix}`);
        }
        
        updateConversionDisplay(stack, postfix);
    }
    
    while (stack.length) {
        postfix += stack.pop();
    }
    
    steps.push(`Final: pop remaining operators → ${postfix}`);
    updateConversionDisplay([], postfix);
    displayConversionSteps(steps);
}

function updateConversionDisplay(stack, postfix) {
    document.getElementById('operatorStack').textContent = stack.length ? stack.join(' ') : 'Empty';
    document.getElementById('postfixOutput').textContent = postfix || 'Building...';
}

function displayConversionSteps(steps) {
    const container = document.getElementById('conversionSteps');
    container.innerHTML = '<h4>Conversion Steps:</h4>';
    steps.forEach((step, index) => {
        const div = document.createElement('div');
        div.className = 'step';
        div.textContent = `${index + 1}. ${step}`;
        container.appendChild(div);
    });
}

// Postfix Evaluation Visualization
function evaluatePostfixExpression() {
    const input = document.getElementById('postfixInput').value.trim();
    if (!input) {
        alert('Please enter a postfix expression');
        return;
    }
    
    const stack = [];
    const steps = [];
    
    for (let i = 0; i < input.length; i++) {
        const char = input[i];
        
        if (/\d/.test(char)) {
            stack.push(parseInt(char));
            steps.push(`'${char}' is operand → push to stack: [${stack.join(', ')}]`);
        } else if ('+-*/'.includes(char)) {
            if (stack.length < 2) {
                alert('Invalid expression: not enough operands');
                return;
            }
            const b = stack.pop();
            const a = stack.pop();
            let result;
            
            switch (char) {
                case '+': result = a + b; break;
                case '-': result = a - b; break;
                case '*': result = a * b; break;
                case '/': result = Math.floor(a / b); break;
            }
            
            stack.push(result);
            steps.push(`'${char}' → pop ${b}, ${a} → ${a} ${char} ${b} = ${result} → push: [${stack.join(', ')}]`);
        }
        
        updateEvaluationDisplay(stack);
    }
    
    const finalResult = stack.length === 1 ? stack[0] : 'Error';
    document.getElementById('evaluationResult').textContent = finalResult;
    displayEvaluationSteps(steps);
}

function updateEvaluationDisplay(stack) {
    document.getElementById('operandStack').textContent = stack.length ? stack.join(' ') : 'Empty';
}

function displayEvaluationSteps(steps) {
    const container = document.getElementById('evaluationSteps');
    container.innerHTML = '<h4>Evaluation Steps:</h4>';
    steps.forEach((step, index) => {
        const div = document.createElement('div');
        div.className = 'step';
        div.textContent = `${index + 1}. ${step}`;
        container.appendChild(div);
    });
}

// Towers of Hanoi Visualization
let hanoiMoves = 0;
let hanoiAnimation = false;

function startHanoi() {
    const diskCount = parseInt(document.getElementById('diskCount').value);
    if (diskCount < 1 || diskCount > 4) {
        alert('Please enter 1-4 disks');
        return;
    }
    
    if (hanoiAnimation) return;
    
    resetHanoi();
    setupDisks(diskCount);
    hanoiMoves = 0;
    hanoiAnimation = true;
    
    document.getElementById('hanoiInfo').textContent = 'Solving...';
    
    setTimeout(() => {
        solveHanoi(diskCount, 'A', 'B', 'C', () => {
            hanoiAnimation = false;
            document.getElementById('hanoiInfo').textContent = `Completed in ${hanoiMoves} moves! (Optimal: ${Math.pow(2, diskCount) - 1})`;
        });
    }, 500);
}

function resetHanoi() {
    hanoiAnimation = false;
    hanoiMoves = 0;
    ['A', 'B', 'C'].forEach(tower => {
        const pole = document.querySelector(`#tower${tower} .tower-pole`);
        pole.innerHTML = '';
    });
    document.getElementById('hanoiInfo').textContent = 'Set number of disks and click Start';
}

function setupDisks(count) {
    const towerA = document.querySelector('#towerA .tower-pole');
    for (let i = count; i >= 1; i--) {
        const disk = document.createElement('div');
        disk.className = `disk disk-${i}`;
        disk.textContent = i;
        towerA.appendChild(disk);
    }
}

function solveHanoi(n, source, helper, dest, callback) {
    if (n === 1) {
        setTimeout(() => {
            moveDisk(source, dest);
            if (callback) callback();
        }, 600 * hanoiMoves);
        hanoiMoves++;
    } else {
        solveHanoi(n - 1, source, dest, helper);
        setTimeout(() => {
            moveDisk(source, dest);
        }, 600 * hanoiMoves);
        hanoiMoves++;
        solveHanoi(n - 1, helper, source, dest, callback);
    }
}

function moveDisk(from, to) {
    const fromPole = document.querySelector(`#tower${from} .tower-pole`);
    const toPole = document.querySelector(`#tower${to} .tower-pole`);
    
    const disk = fromPole.lastElementChild;
    if (disk) {
        fromPole.removeChild(disk);
        toPole.appendChild(disk);
    }
}

// Double Linked List Visualization
let doubleLinkedList = [];

function doubleInsertBegin() {
    const input = document.getElementById('doubleListValue');
    const value = parseInt(input.value);
    
    if (!value || value < 1 || value > 99) {
        updateDoubleListInfo('Please enter a valid number (1-99)');
        return;
    }
    
    doubleLinkedList.unshift(value);
    renderDoubleList();
    updateDoubleListInfo(`Inserted ${value} at beginning. List size: ${doubleLinkedList.length}`);
    input.value = '';
}

function doubleInsertEnd() {
    const input = document.getElementById('doubleListValue');
    const value = parseInt(input.value);
    
    if (!value || value < 1 || value > 99) {
        updateDoubleListInfo('Please enter a valid number (1-99)');
        return;
    }
    
    doubleLinkedList.push(value);
    renderDoubleList();
    updateDoubleListInfo(`Inserted ${value} at end. List size: ${doubleLinkedList.length}`);
    input.value = '';
}

function doubleDelete() {
    const input = document.getElementById('doubleListValue');
    const value = parseInt(input.value);
    
    if (!value || value < 1 || value > 99) {
        updateDoubleListInfo('Please enter a valid number (1-99)');
        return;
    }
    
    const index = doubleLinkedList.indexOf(value);
    if (index === -1) {
        updateDoubleListInfo(`Value ${value} not found in list`);
        return;
    }
    
    doubleLinkedList.splice(index, 1);
    renderDoubleList();
    updateDoubleListInfo(`Deleted ${value}. List size: ${doubleLinkedList.length}`);
    input.value = '';
}

function doubleTraverseForward() {
    if (doubleLinkedList.length === 0) {
        updateDoubleListInfo('List is empty - nothing to traverse');
        return;
    }
    
    updateDoubleListInfo('Traversing forward: ' + doubleLinkedList.join(' → '));
    highlightTraversal('forward');
}

function doubleTraverseBackward() {
    if (doubleLinkedList.length === 0) {
        updateDoubleListInfo('List is empty - nothing to traverse');
        return;
    }
    
    const reversed = [...doubleLinkedList].reverse();
    updateDoubleListInfo('Traversing backward: ' + reversed.join(' ← '));
    highlightTraversal('backward');
}

function resetDoubleList() {
    doubleLinkedList = [];
    renderDoubleList();
    updateDoubleListInfo('List reset - now empty');
}

function renderDoubleList() {
    const container = document.getElementById('doubleListElements');
    container.innerHTML = '';
    
    if (doubleLinkedList.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'double-list-empty';
        empty.textContent = 'List is empty';
        container.appendChild(empty);
        return;
    }
    
    // Add NULL at beginning
    const nullStart = document.createElement('div');
    nullStart.className = 'double-arrow';
    nullStart.innerHTML = 'NULL<br>←';
    nullStart.style.color = 'var(--text-muted)';
    container.appendChild(nullStart);
    
    doubleLinkedList.forEach((value, index) => {
        const nodeContainer = document.createElement('div');
        nodeContainer.className = 'double-node';
        
        const nodeWrapper = document.createElement('div');
        nodeWrapper.className = 'double-node-container';
        
        const pointers = document.createElement('div');
        pointers.className = 'double-node-pointers';
        
        const prevPointer = document.createElement('div');
        prevPointer.className = 'prev-pointer';
        prevPointer.textContent = 'prev';
        
        const nextPointer = document.createElement('div');
        nextPointer.className = 'next-pointer';
        nextPointer.textContent = 'next';
        
        pointers.appendChild(prevPointer);
        pointers.appendChild(nextPointer);
        
        const data = document.createElement('div');
        data.className = 'double-node-data';
        data.textContent = value;
        data.id = `double-node-${index}`;
        
        nodeWrapper.appendChild(pointers);
        nodeWrapper.appendChild(data);
        nodeContainer.appendChild(nodeWrapper);
        
        if (index < doubleLinkedList.length - 1) {
            const arrows = document.createElement('div');
            arrows.className = 'double-arrow';
            arrows.innerHTML = '<div class="forward-arrow">→</div><div class="backward-arrow">←</div>';
            nodeContainer.appendChild(arrows);
        }
        
        container.appendChild(nodeContainer);
    });
    
    // Add NULL at end
    const nullEnd = document.createElement('div');
    nullEnd.className = 'double-arrow';
    nullEnd.innerHTML = '→<br>NULL';
    nullEnd.style.color = 'var(--text-muted)';
    container.appendChild(nullEnd);
}

function highlightTraversal(direction) {
    const nodes = document.querySelectorAll('.double-node-data');
    const highlightClass = direction === 'forward' ? 'highlight-forward' : 'highlight-backward';
    
    nodes.forEach(node => node.classList.remove('highlight-forward', 'highlight-backward'));
    
    const indices = direction === 'forward' ? 
        Array.from({length: doubleLinkedList.length}, (_, i) => i) :
        Array.from({length: doubleLinkedList.length}, (_, i) => doubleLinkedList.length - 1 - i);
    
    indices.forEach((index, step) => {
        setTimeout(() => {
            const node = document.getElementById(`double-node-${index}`);
            if (node) {
                node.classList.add(highlightClass);
                setTimeout(() => {
                    node.classList.remove(highlightClass);
                }, 500);
            }
        }, step * 600);
    });
}

function updateDoubleListInfo(message) {
    const info = document.getElementById('doubleListInfo');
    if (info) {
        info.textContent = message;
        
        setTimeout(() => {
            if (doubleLinkedList.length === 0) {
                info.textContent = 'List is empty';
            } else {
                info.textContent = `Doubly linked list has ${doubleLinkedList.length} node(s). Head: ${doubleLinkedList[0]}, Tail: ${doubleLinkedList[doubleLinkedList.length - 1]}`;
            }
        }, 3000);
    }
}

