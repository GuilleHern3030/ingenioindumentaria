console.admin = (...params) => 
    localStorage.getItem('admin') != null || location.hostname.includes("localhost") || location.hostname.includes("192.168.1") ? 
        console.log(...params) : null