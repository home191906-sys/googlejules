const API = "http://localhost:8000";
let currentToken = localStorage.getItem("lms_token");
let currentCourseId = null;

// ========== Page Load ==========
window.onload = () => {
    loadCourses();
    if (currentToken) {
        const name = localStorage.getItem("lms_name");
        showLoggedIn(name);
    }
};

// ========== AUTH ==========
function showAuth(type) {
    document.getElementById("loginForm").classList.toggle("d-none", type !== "login");
    document.getElementById("registerForm").classList.toggle("d-none", type !== "register");
    document.getElementById("authTitle").innerText = type === "login" ? "Login" : "Register";
    new bootstrap.Modal(document.getElementById("authModal")).show();
}

async function doLogin() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email, password})
    });
    const data = await res.json();
    if (res.ok) {
        localStorage.setItem("lms_token", data.token);
        localStorage.setItem("lms_name", data.student.name);
        currentToken = data.token;
        bootstrap.Modal.getInstance(document.getElementById("authModal")).hide();
        showLoggedIn(data.student.name);
        alert("✅ Login successful! Welcome " + data.student.name);
    } else {
        alert("❌ " + data.detail);
    }
}

async function doRegister() {
    const name = document.getElementById("regName").value;
    const email = document.getElementById("regEmail").value;
    const phone = document.getElementById("regPhone").value;
    const password = document.getElementById("regPassword").value;

    const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({name, email, phone, password})
    });
    const data = await res.json();
    if (res.ok) {
        localStorage.setItem("lms_token", data.token);
        localStorage.setItem("lms_name", data.student.name);
        currentToken = data.token;
        bootstrap.Modal.getInstance(document.getElementById("authModal")).hide();
        showLoggedIn(data.student.name);
        alert("✅ Registration successful! Welcome " + data.student.name);
    } else {
        alert("❌ " + data.detail);
    }
}

function showLoggedIn(name) {
    document.getElementById("loginBtn").classList.add("d-none");
    document.getElementById("registerBtn").classList.add("d-none");
    document.getElementById("logoutBtn").classList.remove("d-none");
    document.getElementById("studentName").classList.remove("d-none");
    document.getElementById("studentName").innerText = "👋 " + name;
    document.getElementById("dashboardSection").classList.remove("d-none");
    loadDashboard();
}

function logout() {
    localStorage.removeItem("lms_token");
    localStorage.removeItem("lms_name");
    currentToken = null;
    location.reload();
}

// ========== COURSES ==========
async function loadCourses() {
    const res = await fetch(`${API}/courses/`);
    const courses = await res.json();
    const container = document.getElementById("coursesList");

    if (courses.length === 0) {
        container.innerHTML = `<div class="col-12 text-center text-muted"><i class="fas fa-book fa-3x mb-3"></i><p>Abhi koi course nahi hai</p></div>`;
        return;
    }

    container.innerHTML = courses.map(c => `
        <div class="col-md-4">
            <div class="card course-card h-100">
                ${c.thumbnail ? `<img src="${c.thumbnail}" class="card-img-top" style="height:200px;object-fit:cover;">` : `<div class="bg-gradient" style="height:150px;background:linear-gradient(135deg,#4f46e5,#7c3aed);"></div>`}
                <div class="card-body">
                    <h5 class="card-title fw-bold">${c.title}</h5>
                    <p class="card-text text-muted">${c.description || ''}</p>
                    <p class="text-muted"><i class="fas fa-video me-1"></i>${c.video_count} Videos</p>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <h4 class="text-success fw-bold">${c.price > 0 ? '₹' + c.price : 'FREE'}</h4>
                        <button class="btn btn-primary" onclick="buyCourse(${c.id}, '${c.title}', ${c.price})">
                            ${c.price > 0 ? 'Buy Now' : 'Enroll Free'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join("");
}

function buyCourse(id, title, price) {
    if (!currentToken) {
        alert("Pehle login karo!");
        showAuth("login");
        return;
    }
    currentCourseId = id;
    if (price === 0) {
        enrollFree(id);
        return;
    }
    document.getElementById("payCourseName").innerText = title;
    document.getElementById("payAmount").innerText = price;
    new bootstrap.Modal(document.getElementById("payModal")).show();
}

async function enrollFree(courseId) {
    const res = await fetch(`${API}/courses/${courseId}/enroll?token=${currentToken}`, {method: "POST"});
    const data = await res.json();
    alert(res.ok ? "✅ Enrolled successfully!" : "❌ " + data.detail);
    loadDashboard();
}

// ========== PAYMENT ==========
async function initiatePayment() {
    const res = await fetch(`${API}/payments/create-order`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({course_id: currentCourseId, token: currentToken})
    });
    const order = await res.json();
    if (!res.ok) { alert("❌ " + order.detail); return; }

    const options = {
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        name: "Coaching LMS",
        description: order.course_title,
        order_id: order.order_id,
        handler: async (response) => {
            const verify = await fetch(`${API}/payments/verify`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    course_id: currentCourseId,
                    token: currentToken
                })
            });
            const result = await verify.json();
            bootstrap.Modal.getInstance(document.getElementById("payModal")).hide();
            alert(verify.ok ? "✅ Payment successful! Course enrolled." : "❌ Payment failed!");
            loadDashboard();
        },
        theme: {color: "#4f46e5"}
    };
    new Razorpay(options).open();
}

// ========== DASHBOARD ==========
async function loadDashboard() {
    loadEnrolledCourses();
    loadResults();
    loadPayments();
}

async function loadEnrolledCourses() {
    const res = await fetch(`${API}/courses/my/enrolled?token=${currentToken}`);
    const data = await res.json();
    document.getElementById("enrolledCourses").innerHTML = data.length === 0
        ? `<p class="text-muted">Abhi koi course enrolled nahi hai</p>`
        : `<div class="row g-3">${data.map(c => `
            <div class="col-md-4">
                <div class="card p-3">
                    <h5>${c.title}</h5>
                    <small class="text-muted">Enrolled: ${new Date(c.enrolled_at).toLocaleDateString()}</small>
                    <button class="btn btn-sm btn-outline-primary mt-2" onclick="openCourse(${c.course_id})">Continue</button>
                </div>
            </div>`).join("")}</div>`;
}

async function loadResults() {
    const res = await fetch(`${API}/tests/my/results?token=${currentToken}`);
    const data = await res.json();
    document.getElementById("myResults").innerHTML = data.length === 0
        ? `<p class="text-muted">Abhi koi result nahi hai</p>`
        : `<table class="table table-striped"><thead><tr><th>Test</th><th>Marks</th><th>%</th><th>Status</th><th>Date</th></tr></thead><tbody>
            ${data.map(r => `<tr>
                <td>${r.test}</td>
                <td>${r.marks}</td>
                <td>${r.percentage}%</td>
                <td>${r.passed ? '<span class="badge bg-success">PASS</span>' : '<span class="badge bg-danger">FAIL</span>'}</td>
                <td>${new Date(r.date).toLocaleDateString()}</td>
            </tr>`).join("")}</tbody></table>`;
}

async function loadPayments() {
    const res = await fetch(`${API}/payments/history?token=${currentToken}`);
    const data = await res.json();
    document.getElementById("paymentHistory").innerHTML = data.length === 0
        ? `<p class="text-muted">Koi payment nahi mili</p>`
        : `<table class="table"><thead><tr><th>Course</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead><tbody>
            ${data.map(p => `<tr>
                <td>Course #${p.course_id}</td>
                <td>₹${p.amount}</td>
                <td><span class="badge ${p.status === 'success' ? 'bg-success' : 'bg-warning'}">${p.status}</span></td>
                <td>${new Date(p.date).toLocaleDateString()}</td>
            </tr>`).join("")}</tbody></table>`;
}

function showTab(tabId, el) {
    ["enrolledCourses", "myResults", "paymentHistory"].forEach(id => {
        document.getElementById(id).classList.toggle("d-none", id !== tabId);
    });
    document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
    el.classList.add("active");
}

function scrollToCourses() {
    document.getElementById("coursesSection").scrollIntoView({behavior: "smooth"});
}
