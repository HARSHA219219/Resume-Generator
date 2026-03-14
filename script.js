const LATEX_TEMPLATE = `\\documentclass[a4paper,10pt]{article}
%-----------------------------------------------------------
\\usepackage[top=0.1cm, bottom=0.3cm, left=0.3cm, right=1.1cm, nohead, nofoot]{geometry}
\\usepackage{graphicx}
\\usepackage{url}
\\usepackage{palatino}
\\usepackage{booktabs}
\\usepackage{hyperref}
\\fontfamily{SansSerif}
\\selectfont
        
\\usepackage[T1]{fontenc}
\\usepackage[utf8]{inputenc}
        
\\usepackage{color}
\\definecolor{mygrey}{gray}{0.75}
\\textheight = 29.1 cm
\\raggedbottom
        
\\setlength{\\tabcolsep}{0in}
\\newcommand{\\isep}{-2 pt}
\\newcommand{\\lsep}{-0.6cm}
\\newcommand{\\psep}{-0.6cm}
\\renewcommand{\\labelitemii}{$\\circ$}
        
\\pagestyle{empty}
%-----------------------------------------------------------
%Custom commands
\\newcommand{\\resitem}[1]{\\item #1 \\vspace{-2pt}}
\\newcommand{\\resheading}[1]{{\\small \\colorbox{mygrey}{\\begin{minipage}{0.965\\textwidth}{\\textbf{#1 \\vphantom{p\\^{E}}}}\\end{minipage}}}}
\\newcommand{\\ressubheading}[3]{
\\begin{tabular*}{6.62in}{l @{\\extracolsep{\\fill}} r}
    \\textsc{{\\textbf{#1}}} & \\textsc{\\textit{[#2]}} \\\\
\\end{tabular*}\\vspace{-9pt}}
%-----------------------------------------------------------
        
\\begin{document}
\\hspace{0.75cm}\\\\[-0.54cm]

{\\LARGE \\textbf{<<NAME>>}} \\\\
\\indent <<YEAR>> \\hfill 
\\href{mailto:<<EMAIL>>}{<<EMAIL>>}\\\\  
\\indent <<PROGRAM>> \\hfill  <<PHONE>> \\\\
\\indent <<INSTITUTION>>  \\hfill
\\underline{\\href{<<LINKEDIN>>}{LinkedIn}} |
\\underline{\\href{<<GITHUB>>}{Github}} 
\\\\
<<ACADEMIC_SECTION>>
<<INTERNSHIPS>>
<<PROJECT_SECTION>>
<<SKILLS_SECTION>>
<<COURSEWORK_SECTION>>
<<ACHIEVEMENTS_SECTION>>
<<POR_SECTION>>
<<EXTRACURRICULARS>>

\\end{document}`;

// State Management
const state = {
    pd: {
        name: "",
        roll: "",
        year: "",
        program: "",
        institution: "",
        email: "",
        phone: "",
        github: "",
        linkedin: "",
        website: ""
    },
    academics: [],
    skills: [],
    projects: [],
    coursework: [],
    enableInternships: false,
    internships: [],
    por: [],
    achievements: [],
    enableExtracurriculars: false,
    extracurriculars: []
};

function escapeLatex(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, '\\&')
        .replace(/%/g, '\\%')
        .replace(/\$/g, '\\$')
        .replace(/#/g, '\\#')
        .replace(/_/g, '\\_')
        .replace(/\{/g, '\\{')
        .replace(/\}/g, '\\}')
        .replace(/~/g, '\\textasciitilde{}')
        .replace(/\^/g, '\\textasciicircum{}');
}

function generateLatex() {
    let latex = LATEX_TEMPLATE;

    // Personal Details
    latex = latex.replace(/<<NAME>>/g, escapeLatex(state.pd.name) || "Your Name");
    latex = latex.replace(/<<ROLL>>/g, escapeLatex(state.pd.roll) || "Roll Number");
    latex = latex.replace(/<<YEAR>>/g, escapeLatex(state.pd.year) || "Junior Undergraduate");
    latex = latex.replace(/<<PROGRAM>>/g, escapeLatex(state.pd.program) || "Discipline of Computer Science and Engineering");
    latex = latex.replace(/<<INSTITUTION>>/g, escapeLatex(state.pd.institution) || "Indian Institute of Technology, Gandhinagar");
    latex = latex.replace(/<<EMAIL>>/g, escapeLatex(state.pd.email) || "email@example.com");
    latex = latex.replace(/<<PHONE>>/g, escapeLatex(state.pd.phone) || "+91 0000000000");
    latex = latex.replace(/<<GITHUB>>/g, state.pd.github ? escapeLatex(state.pd.github) : "#");
    latex = latex.replace(/<<LINKEDIN>>/g, state.pd.linkedin ? escapeLatex(state.pd.linkedin) : "#");
    latex = latex.replace(/<<WEBSITE>>/g, state.pd.website ? escapeLatex(state.pd.website) : "#");

    // Academics
    if (state.academics.length > 0) {
        let acRows = `\\indent \\resheading{\\textbf{ACADEMIC DETAILS} }\\\\[\\lsep]\n\\\\ \\\\\n\\indent \\begin{tabular}{ p{1.7cm} @{\\hskip 0.08in} p{5.254cm} @{\\hskip 0.08in} p{7.054cm} @{\\hskip 0.09in} p{2.554cm} @{\\hskip 0.08in} p{1.72cm} }\n\\toprule\n\\textbf{Degree} & \\textbf{Specialization} & \\textbf{Institute} & \\textbf{Year} & \\textbf{CPI/\\%} \\\\\n\\midrule\n`;
        state.academics.forEach(ac => {
            acRows += `${escapeLatex(ac.degree)} & \\textit{${escapeLatex(ac.specialization)}} & ${escapeLatex(ac.institute)} & ${escapeLatex(ac.year)} & ${escapeLatex(ac.cpi)} \\\\\n`;
        });
        acRows += `\\bottomrule\n\\end{tabular}\n\n`;
        latex = latex.replace(/<<ACADEMIC_SECTION>>/g, acRows);
    } else {
        latex = latex.replace(/<<ACADEMIC_SECTION>>/g, "");
    }

    // Internships
    let intSec = "";
    if (state.enableInternships && state.internships.length > 0) {
        let items = "";
        state.internships.forEach(item => {
            items += `  \\item \\textbf{${escapeLatex(item.company)}} \\hfill [${escapeLatex(item.duration)}]\n`;
            items += `  \\\\ \\emph{${escapeLatex(item.description)}}\n`;
        });
        intSec = `\\resheading{\\textbf{INTERNSHIPS} }\n\\vspace{-0.4cm}\n\\begin{itemize}\\itemsep\\isep\n${items}\\end{itemize}\n\n`;
    }
    latex = latex.replace(/<<INTERNSHIPS>>/g, intSec);

    // Projects
    if (state.projects.length > 0) {
        let projItems = `\\resheading{\\textbf{ PROJECTS} }\n\\vspace{-0.4cm}\n\\begin{itemize}\\itemsep\\isep\n`;
        state.projects.forEach(pj => {
            let adStr = pj.advisor ? `(Advisor - ${escapeLatex(pj.advisor)})` : `(Self Project)`;
            let linkStr = pj.link ? ` | \n\\href{${pj.link}}{Project Link}` : ``;

            projItems += `\\item \\textbf{${escapeLatex(pj.title)}} \\hfill [${escapeLatex(pj.duration)}]\\\\\\emph{${adStr}${linkStr}} \\\\[-0.7cm]\n`;

            if (pj.desc1 || pj.desc2) {
                projItems += `\\begin{itemize}\\itemsep  \\isep\n`;
                if (pj.desc1) projItems += `   \\item ${escapeLatex(pj.desc1)}\n`;
                if (pj.desc2) projItems += `   \\item ${escapeLatex(pj.desc2)}\n`;
                projItems += `   \\end{itemize}`;
            }
        });
        projItems += `\n\\end{itemize}\n\n`;
        latex = latex.replace(/<<PROJECT_SECTION>>/g, projItems);
    } else {
        latex = latex.replace(/<<PROJECT_SECTION>>/g, "");
    }

    // Skills
    if (state.skills.length > 0) {
        let skillItems = `\\resheading{\\textbf{TECHNICAL SKILLS} }\n\\vspace{-0.4cm}\n\\begin{itemize} \\itemsep \\isep\n`;
        state.skills.forEach(sk => {
            skillItems += `\\item \\textbf{${escapeLatex(sk.category)}} : ${escapeLatex(sk.description)}\n`;
        });
        skillItems += `\\end{itemize}\n\n`;
        latex = latex.replace(/<<SKILLS_SECTION>>/g, skillItems);
    } else {
        latex = latex.replace(/<<SKILLS_SECTION>>/g, "");
    }

    // Coursework
    if (state.coursework.length > 0) {
        let cwStr = `\\resheading{\\textbf{RELEVANT COURSEWORK}}\n\\vspace{-0.3cm}\n\n\\begin{itemize} \\itemsep 0pt \\parskip 0pt \\parsep 0pt\n\\item[] \\begin{tabular}{@{}l@{\\hspace{0.8cm}}l@{\\hspace{0.8cm}}l}\n`;

        for (let i = 0; i < state.coursework.length; i += 3) {
            let col1 = state.coursework[i] ? `$\\bullet$ ${escapeLatex(state.coursework[i].name)}` : '';
            let col2 = state.coursework[i + 1] ? ` & $\\bullet$ ${escapeLatex(state.coursework[i + 1].name)}` : (col1 ? ' &' : '');
            let col3 = state.coursework[i + 2] ? ` & $\\bullet$ ${escapeLatex(state.coursework[i + 2].name)} \\\\` : (col2 ? ' \\\\' : '');
            if (col1) cwStr += `${col1}${col2}${col3}\n`;
        }

        cwStr += `\\end{tabular}\n\\end{itemize}\n\n`;
        latex = latex.replace(/<<COURSEWORK_SECTION>>/g, cwStr);
    } else {
        latex = latex.replace(/<<COURSEWORK_SECTION>>/g, "");
    }


    // Achievements
    if (state.achievements.length > 0) {
        let achSec = `\\resheading{\\textbf{ACADEMIC ACHIEVEMENTS} }\n\\vspace{-0.4cm}\n\\begin{itemize} \\itemsep \\isep\n`;
        state.achievements.forEach(a => {
            achSec += `\\item ${escapeLatex(a.description)}\n`;
        });
        achSec += `\\end{itemize}\n\n`;
        latex = latex.replace(/<<ACHIEVEMENTS_SECTION>>/g, achSec);
    } else {
        latex = latex.replace(/<<ACHIEVEMENTS_SECTION>>/g, "");
    }

    // POR
    if (state.por.length > 0) {
        let porSec = `\\resheading{\\textbf{POSITION OF RESPONSIBILITIES} }\n\\vspace{-0.4cm}\n\\begin{itemize} \\itemsep \\isep\n`;
        state.por.forEach(p => {
            let dur = p.duration ? ` [${escapeLatex(p.duration)}]` : "";
            porSec += `\\item \\textbf{${escapeLatex(p.position)}}, ${escapeLatex(p.organization)}${dur} – ${escapeLatex(p.description)}\n`;
        });
        porSec += `\\end{itemize}\n\n`;
        latex = latex.replace(/<<POR_SECTION>>/g, porSec);
    } else {
        latex = latex.replace(/<<POR_SECTION>>/g, "");
    }


    // Extracurriculars
    let extSec = "";
    if (state.enableExtracurriculars && state.extracurriculars.length > 0) {
        extSec = `\\resheading{\\textbf{EXTRACURRICULAR ACTIVITIES} }\n\\vspace{-0.4cm}\n\\begin{itemize} \\itemsep \\isep\n`;
        state.extracurriculars.forEach(e => {
            extSec += `\\item \\textbf{${escapeLatex(e.activity)}}: ${escapeLatex(e.description)}\n`;
        });
        extSec += `\\end{itemize}\n\n`;
    }
    latex = latex.replace(/<<EXTRACURRICULARS>>/g, extSec);

    document.getElementById("latex-preview").textContent = latex;
    document.getElementById("overleaf-snip").value = latex;

    generateVisualPreview();
}

function generateVisualPreview() {
    const paper = document.getElementById("resume-preview");

    // Header
    let html = `
        <h1>${state.pd.name || "Your Name"}</h1>
        <div class="contact-info">
            ${state.pd.year || "Junior Undergraduate"} | 
            <a href="mailto:${state.pd.email}">${state.pd.email || "email@example.com"}</a><br>
            ${state.pd.program || "Discipline of Computer Science and Engineering"} | ${state.pd.phone || "+91 0000000000"}<br>
            ${state.pd.institution || "Indian Institute of Technology, Gandhinagar"} | 
            <a href="${state.pd.linkedin || '#'}">LinkedIn</a> | 
            <a href="${state.pd.github || '#'}">Github</a>
        </div>
    `;

    // Academics
    if (state.academics.length > 0) {
        html += `<h2>Academic Details</h2>
            <table>
                <tr>
                    <th>Degree</th>
                    <th>Specialization</th>
                    <th>Institute</th>
                    <th>Year</th>
                    <th>CPI/%</th>
                </tr>
        `;
        state.academics.forEach(ac => {
            html += `<tr>
                <td>${ac.degree}</td>
                <td><i>${ac.specialization}</i></td>
                <td>${ac.institute}</td>
                <td>${ac.year}</td>
                <td>${ac.cpi}</td>
            </tr>`;
        });
        html += `</table>`;
    }

    // Internships
    if (state.enableInternships && state.internships.length > 0) {
        html += `<h2>Internships</h2><ul>`;
        state.internships.forEach(it => {
            html += `<li>
                <div class="item-header">
                    <strong>${it.company}</strong>
                    <span>[${it.duration}]</span>
                </div>
                <div class="item-subheader">${it.description}</div>
            </li>`;
        });
        html += `</ul>`;
    }

    // Projects
    if (state.projects.length > 0) {
        html += `<h2>Projects</h2><ul>`;
        state.projects.forEach(pj => {
            let adStr = pj.advisor ? `(Advisor - ${pj.advisor})` : `(Self Project)`;
            html += `<li>
                <div class="item-header">
                    <strong>${pj.title}</strong>
                    <span>[${pj.duration}]</span>
                </div>
                <div class="item-subheader">${adStr}</div>
            `;
            if (pj.desc1 || pj.desc2) {
                html += `<ul>`;
                if (pj.desc1) html += `<li>${pj.desc1}</li>`;
                if (pj.desc2) html += `<li>${pj.desc2}</li>`;
                html += `</ul>`;
            }
            html += `</li>`;
        });
        html += `</ul>`;
    }

    // Skills
    if (state.skills.length > 0) {
        html += `<h2>Technical Skills</h2><ul>`;
        state.skills.forEach(sk => {
            html += `<li><strong>${sk.category}:</strong> ${sk.description}</li>`;
        });
        html += `</ul>`;
    }

    // Coursework
    if (state.coursework.length > 0) {
        html += `<h2>Relevant Coursework</h2><ul>`;
        for (let i = 0; i < state.coursework.length; i += 3) {
            let row = [];
            if (state.coursework[i]) row.push(state.coursework[i].name);
            if (state.coursework[i + 1]) row.push(state.coursework[i + 1].name);
            if (state.coursework[i + 2]) row.push(state.coursework[i + 2].name);
            html += `<li style="list-style-type: none;">&bull; ${row.join(' &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &bull; ')}</li>`;
        }
        html += `</ul>`;
    }

    // Achievements
    if (state.achievements.length > 0) {
        html += `<h2>Academic Achievements</h2><ul>`;
        state.achievements.forEach(a => {
            html += `<li>${a.description}</li>`;
        });
        html += `</ul>`;
    }

    // POR
    if (state.por.length > 0) {
        html += `<h2>Position of Responsibilities</h2><ul>`;
        state.por.forEach(p => {
            let dur = p.duration ? ` [${p.duration}]` : "";
            html += `<li><strong>${p.position}</strong>, ${p.organization}${dur} – ${p.description}</li>`;
        });
        html += `</ul>`;
    }

    // Extracurriculars
    if (state.enableExtracurriculars && state.extracurriculars.length > 0) {
        html += `<h2>Extracurricular Activities</h2><ul>`;
        state.extracurriculars.forEach(e => {
            html += `<li><strong>${e.activity}:</strong> ${e.description}</li>`;
        });
        html += `</ul>`;
    }

    paper.innerHTML = html;
}

// Tab Switching Logic
document.getElementById('tab-visual').addEventListener('click', () => {
    document.getElementById('tab-visual').classList.add('active');
    document.getElementById('tab-code').classList.remove('active');
    document.getElementById('visual-pane').classList.add('active');
    document.getElementById('code-pane').classList.remove('active');
});

document.getElementById('tab-code').addEventListener('click', () => {
    document.getElementById('tab-code').classList.add('active');
    document.getElementById('tab-visual').classList.remove('active');
    document.getElementById('code-pane').classList.add('active');
    document.getElementById('visual-pane').classList.remove('active');
});

// Event Listeners for Personal Details
document.querySelectorAll(".form-section input[id^='pd-']").forEach(input => {
    input.addEventListener("input", (e) => {
        const key = e.target.id.replace("pd-", "");
        state.pd[key] = e.target.value;
        generateLatex();
    });
});

// Toggles
document.getElementById("enable-internships").addEventListener("change", (e) => {
    state.enableInternships = e.target.checked;
    document.getElementById("internships-content").classList.toggle("active", state.enableInternships);
    generateLatex();
});

document.getElementById("enable-extracurriculars").addEventListener("change", (e) => {
    state.enableExtracurriculars = e.target.checked;
    document.getElementById("extracurriculars-content").classList.toggle("active", state.enableExtracurriculars);
    generateLatex();
});

// Generic Add/Render/Delete Functions for Lists
function renderList(listId, dataArray, renderItemHtml, onEdit, onDelete) {
    const listEl = document.getElementById(listId);
    listEl.innerHTML = "";
    dataArray.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "list-item";

        const content = document.createElement("div");
        content.className = "list-item-content";
        content.innerHTML = renderItemHtml(item);

        const actions = document.createElement("div");
        actions.className = "list-item-actions";

        const editBtn = document.createElement("button");
        editBtn.className = "btn btn-outline";
        editBtn.style.marginTop = "0";
        editBtn.style.padding = "0.25rem 0.5rem";
        editBtn.innerHTML = `<i data-lucide="edit-2" style="width: 14px; height: 14px;"></i>`;
        editBtn.onclick = () => onEdit(index);

        const delBtn = document.createElement("button");
        delBtn.className = "btn btn-danger";
        delBtn.innerHTML = `<i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>`;
        delBtn.onclick = () => onDelete(index);

        actions.appendChild(editBtn);
        actions.appendChild(delBtn);

        div.appendChild(content);
        div.appendChild(actions);
        listEl.appendChild(div);
    });
    // Re-initialize lucide icons for dynamically added ones
    if (window.lucide) {
        lucide.createIcons();
    }
}

// Academics
document.getElementById("add-academic-btn").addEventListener("click", () => {
    const degree = document.getElementById("ac-degree").value;
    const spec = document.getElementById("ac-specialization").value;
    const inst = document.getElementById("ac-institute").value;
    const year = document.getElementById("ac-year").value;
    const cpi = document.getElementById("ac-cpi").value;

    if (!degree) return;

    state.academics.push({ degree, specialization: spec, institute: inst, year, cpi });

    document.querySelectorAll("#academic-form input").forEach(i => i.value = "");
    updateAcademics();
});

function updateAcademics() {
    renderList("academic-list", state.academics,
        (item) => `<div class="list-item-title">${item.degree} in ${item.specialization}</div><div class="list-item-subtitle">${item.institute} | ${item.year} | ${item.cpi}</div>`,
        (idx) => {
            const el = state.academics[idx];
            document.getElementById("ac-degree").value = el.degree;
            document.getElementById("ac-specialization").value = el.specialization;
            document.getElementById("ac-institute").value = el.institute;
            document.getElementById("ac-year").value = el.year;
            document.getElementById("ac-cpi").value = el.cpi;
            state.academics.splice(idx, 1);
            updateAcademics();
        },
        (idx) => {
            state.academics.splice(idx, 1);
            updateAcademics();
        }
    );
    generateLatex();
}

// Skills
document.getElementById("add-skill-btn").addEventListener("click", () => {
    const cat = document.getElementById("sk-category").value;
    const desc = document.getElementById("sk-description").value;
    if (!cat) return;
    state.skills.push({ category: cat, description: desc });
    document.querySelectorAll("#skill-form input").forEach(i => i.value = "");
    updateSkills();
});

function updateSkills() {
    renderList("skills-list", state.skills,
        (item) => `<div class="list-item-title">${item.category}</div><div class="list-item-subtitle">${item.description}</div>`,
        (idx) => {
            const el = state.skills[idx];
            document.getElementById("sk-category").value = el.category;
            document.getElementById("sk-description").value = el.description;
            state.skills.splice(idx, 1);
            updateSkills();
        },
        (idx) => {
            state.skills.splice(idx, 1);
            updateSkills();
        }
    );
    generateLatex();
}

// Coursework
document.getElementById("add-coursework-btn").addEventListener("click", () => {
    const name = document.getElementById("cw-name").value;
    if (!name) return;
    state.coursework.push({ name: name });
    document.querySelectorAll("#coursework-form input").forEach(i => i.value = "");
    updateCoursework();
});

function updateCoursework() {
    renderList("coursework-list", state.coursework,
        (item) => `<div class="list-item-title">${item.name}</div>`,
        (idx) => {
            const el = state.coursework[idx];
            document.getElementById("cw-name").value = el.name;
            state.coursework.splice(idx, 1);
            updateCoursework();
        },
        (idx) => {
            state.coursework.splice(idx, 1);
            updateCoursework();
        }
    );
    generateLatex();
}

// Projects
document.getElementById("add-project-btn").addEventListener("click", () => {
    const pj = {
        title: document.getElementById("pj-title").value,
        advisor: document.getElementById("pj-advisor").value,
        duration: document.getElementById("pj-duration").value,
        link: document.getElementById("pj-link").value,
        desc1: document.getElementById("pj-desc1").value,
        desc2: document.getElementById("pj-desc2").value
    };
    if (!pj.title) return;
    state.projects.push(pj);
    document.querySelectorAll("#project-form input").forEach(i => i.value = "");
    updateProjects();
});

function updateProjects() {
    renderList("projects-list", state.projects,
        (item) => `<div class="list-item-title">${item.title}</div><div class="list-item-subtitle">${item.duration} | Advisor: ${item.advisor || "Self"}</div>`,
        (idx) => {
            const el = state.projects[idx];
            document.getElementById("pj-title").value = el.title;
            document.getElementById("pj-advisor").value = el.advisor;
            document.getElementById("pj-duration").value = el.duration;
            document.getElementById("pj-link").value = el.link;
            document.getElementById("pj-desc1").value = el.desc1;
            document.getElementById("pj-desc2").value = el.desc2;
            state.projects.splice(idx, 1);
            updateProjects();
        },
        (idx) => {
            state.projects.splice(idx, 1);
            updateProjects();
        }
    );
    generateLatex();
}

// Internships
document.getElementById("add-internship-btn").addEventListener("click", () => {
    const it = {
        company: document.getElementById("in-company").value,
        duration: document.getElementById("in-duration").value,
        description: document.getElementById("in-description").value
    };
    if (!it.company) return;
    state.internships.push(it);
    document.querySelectorAll("#internship-form input").forEach(i => i.value = "");
    updateInternships();
});

function updateInternships() {
    renderList("internships-list", state.internships,
        (item) => `<div class="list-item-title">${item.company}</div><div class="list-item-subtitle">${item.duration}</div>`,
        (idx) => {
            const el = state.internships[idx];
            document.getElementById("in-company").value = el.company;
            document.getElementById("in-duration").value = el.duration;
            document.getElementById("in-description").value = el.description;
            state.internships.splice(idx, 1);
            updateInternships();
        },
        (idx) => {
            state.internships.splice(idx, 1);
            updateInternships();
        }
    );
    generateLatex();
}

// POR
document.getElementById("add-por-btn").addEventListener("click", () => {
    const por = {
        position: document.getElementById("por-position").value,
        organization: document.getElementById("por-organization").value,
        duration: document.getElementById("por-duration").value,
        description: document.getElementById("por-description").value
    };
    if (!por.position) return;
    state.por.push(por);
    document.querySelectorAll("#por-form input").forEach(i => i.value = "");
    updatePor();
});

function updatePor() {
    renderList("por-list", state.por,
        (item) => `<div class="list-item-title">${item.position}</div><div class="list-item-subtitle">${item.organization} | ${item.duration}</div>`,
        (idx) => {
            const el = state.por[idx];
            document.getElementById("por-position").value = el.position;
            document.getElementById("por-organization").value = el.organization;
            document.getElementById("por-duration").value = el.duration;
            document.getElementById("por-description").value = el.description;
            state.por.splice(idx, 1);
            updatePor();
        },
        (idx) => {
            state.por.splice(idx, 1);
            updatePor();
        }
    );
    generateLatex();
}

// Achievements
document.getElementById("add-achievement-btn").addEventListener("click", () => {
    const desc = document.getElementById("ach-description").value;
    if (!desc) return;
    state.achievements.push({ description: desc });
    document.querySelectorAll("#achievement-form input").forEach(i => i.value = "");
    updateAchievements();
});

function updateAchievements() {
    renderList("achievements-list", state.achievements,
        (item) => `<div class="list-item-title">${item.description}</div>`,
        (idx) => {
            const el = state.achievements[idx];
            document.getElementById("ach-description").value = el.description;
            state.achievements.splice(idx, 1);
            updateAchievements();
        },
        (idx) => {
            state.achievements.splice(idx, 1);
            updateAchievements();
        }
    );
    generateLatex();
}

// Extracurriculars
document.getElementById("add-extracurricular-btn").addEventListener("click", () => {
    const ext = {
        activity: document.getElementById("ex-activity").value,
        description: document.getElementById("ex-description").value
    };
    if (!ext.activity) return;
    state.extracurriculars.push(ext);
    document.querySelectorAll("#extracurricular-form input").forEach(i => i.value = "");
    updateExt();
});

function updateExt() {
    renderList("extracurriculars-list", state.extracurriculars,
        (item) => `<div class="list-item-title">${item.activity}</div><div class="list-item-subtitle">${item.description}</div>`,
        (idx) => {
            const el = state.extracurriculars[idx];
            document.getElementById("ex-activity").value = el.activity;
            document.getElementById("ex-description").value = el.description;
            state.extracurriculars.splice(idx, 1);
            updateExt();
        },
        (idx) => {
            state.extracurriculars.splice(idx, 1);
            updateExt();
        }
    );
    generateLatex();
}

// Copy Logic
document.getElementById("copy-btn").addEventListener("click", () => {
    const latexText = document.getElementById("latex-preview").textContent;
    navigator.clipboard.writeText(latexText).then(() => {
        const btn = document.getElementById("copy-btn");
        const originalText = btn.innerHTML;
        btn.innerHTML = `<i data-lucide="check" style="color: var(--success)"></i> Copied!`;
        lucide.createIcons();
        setTimeout(() => {
            btn.innerHTML = originalText;
            lucide.createIcons();
        }, 2000);
    });
});

// Initial Gen
generateLatex();
