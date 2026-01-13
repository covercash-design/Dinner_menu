// --- DATA STORE ---

const mainsData = [
    { 
        id: 'm1', 
        name: "Thai Coconut Curry Soup", 
        time: 20, 
        timeDisplay: "20 min", 
        energy: "Low", 
        icon: "⚡️", 
        notes: "Turkey Sub", 
        category: "Low",
        pdfLink: "" // Paste link to PDF here later
    },
    { 
        id: 'm2', 
        name: "One-Pan Cheesy Tortilla Melts", 
        time: 25, 
        timeDisplay: "25 min", 
        energy: "Low", 
        icon: "⚡️", 
        notes: "", 
        category: "Low",
        pdfLink: ""
    },
    { 
        id: 'm3', 
        name: "Mozzarella & Herb Chicken", 
        time: 30, 
        timeDisplay: "30 min", 
        energy: "Med", 
        icon: "⚖️", 
        notes: "", 
        category: "Med",
        pdfLink: ""
    },
    { 
        id: 'm4', 
        name: "Soy-Glazed Hoisin Meatloaves", 
        time: 40, 
        timeDisplay: "40 min", 
        energy: "Med", 
        icon: "⚖️", 
        notes: "", 
        category: "Med",
        pdfLink: ""
    },
    { 
        id: 'm5', 
        name: "Onion Crunch Chicken", 
        time: 40, 
        timeDisplay: "40 min", 
        energy: "Med", 
        icon: "⚖️", 
        notes: "", 
        category: "Med",
        pdfLink: ""
    },
    { 
        id: 'm6', 
        name: "Korean Glazed Meatloaf", 
        time: 45, 
        timeDisplay: "~45 min", 
        energy: "Med", 
        icon: "⚖️", 
        notes: "", 
        category: "Med",
        pdfLink: ""
    },
    { 
        id: 'm7', 
        name: "Patrick’s Famous Chili", 
        time: 120, 
        timeDisplay: "Simmer", 
        energy: "Slow/Comfort", 
        icon: "🛋️", 
        notes: "", 
        category: "Slow",
        pdfLink: ""
    },
    { 
        id: 'm8', 
        name: "Patrick’s Potato Soup", 
        time: 240, 
        timeDisplay: "Slow Cooker", 
        energy: "Slow/Comfort", 
        icon: "🛋️", 
        notes: "", 
        category: "Slow",
        pdfLink: ""
    },
    { 
        id: 'm9', 
        name: "Patrick’s Corn Chowder", 
        time: 120, 
        timeDisplay: "Simmer", 
        energy: "Slow/Comfort", 
        icon: "🛋️", 
        notes: "", 
        category: "Slow",
        pdfLink: ""
    },
    { 
        id: 'm10', 
        name: "Beef Roast Dinner", 
        time: 420, 
        timeDisplay: "Slow Cooker", 
        energy: "Slow/Comfort", 
        icon: "🛋️", 
        notes: "", 
        category: "Slow",
        pdfLink: ""
    },
    { 
        id: 'm11', 
        name: "Homemade Pizza", 
        time: 15, 
        timeDisplay: "15 min", 
        energy: "Tradition", 
        icon: "🍕", 
        notes: "Friday Tradition", 
        category: "Pizza",
        pdfLink: ""
    }
];

const sidesData = [
    "Steamed Broccoli", 
    "Mashed Sweet Potatoes", 
    "Roasted Carrots (425°F)", 
    "Roasted Green Beans", 
    "Buttery Couscous", 
    "Jasmine Rice"
];

const sweetsData = [
    "Whipped Shortbread", 
    "Dark Chocolate", 
    "Berries & Cream", 
    "Frozen Yoghurt", 
    "Fruit Salad"
];

const newIdeasData = [
    { name: "Vegan Taco Soup", meta: "30 min, Quinoa & Black Beans" },
    { name: "Caramelized Onion, Steak & Cheese Skillet", meta: "Philly cheesesteak vibes" },
    { name: "Coconut Curry Lentil Veggie Stew", meta: "Meatless, similar to Thai soup" },
    { name: "Sheet-Pan Chimichurri Fish", meta: "30 min, light" },
    { name: "Shortcut Shakshuka with Feta", meta: "15 min, breakfast-for-dinner" },
    { name: "High-Protein Cheesy Pork Biscuits", meta: "Make-ahead breakfast, 50 mins" }
];

const emergencyData = ["Morning Star Chicken Patties"];
