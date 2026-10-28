document.getElementById('assignmentForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const subject = document.getElementById('subjectName').value;
    const title = document.getElementById('assignmentTitle').value;
    const desc = document.getElementById('assignmentDesc').value;
    const fileInput = document.getElementById('assignmentFile');
    
    if(fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function(event) {
            const fileData = event.target.result;
            
            const assignmentObj = {
                subject,
                title,
                desc,
                fileName: file.name,
                fileData,
                date: new Date().toLocaleDateString()
            };

            // حفظ في الـ LocalStorage عشان البيانات تتبنى وماتتمسحش لما تقفل المتصفح
            let assignments = JSON.parse(localStorage.getItem('myAssignments')) || [];
            assignments.push(assignmentObj);
            localStorage.setItem('myAssignments', JSON.stringify(assignments));

            alert('تم رفع وحفظ الأسساينمنت بنجاح! 🚀');
            document.getElementById('assignmentForm').reset();
            loadAssignments();
        };

        reader.readAsDataURL(file);
    }
});

function loadAssignments() {
    const container = document.getElementById('containerList');
    container.innerHTML = '';
    
    let assignments = JSON.parse(localStorage.getItem('myAssignments')) || [];

    if (assignments.length === 0) {
        container.innerHTML = '<p style="color: #94a3b8; text-align: center; grid-column: 1 / -1;">لا توجد أسساينمنتس محفوظة حالياً.</p>';
        return;
    }

    assignments.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'assignment-item';
        div.innerHTML = `
            <h4>📚 ${item.subject}</h4>
            <p><strong>العنوان:</strong> ${item.title}</p>
            <p><strong>الوصف:</strong> ${item.desc || 'لا يوجد وصف'}</p>
            <p><strong>التاريخ:</strong> ${item.date}</p>
            <div class="item-actions">
                <a href="${item.fileData}" download="${item.fileName}" class="btn-download">📥 تحميل الملف</a>
                <button onclick="deleteAssignment(${index})" class="btn-delete">🗑️ حذف</button>
            </div>
        `;
        container.appendChild(div);
    });
}

// دالة حذف الأسساينمنت
function deleteAssignment(index) {
    if (confirm('هل أنت متأكد أنك تريد حذف هذا الأسساينمنت؟')) {
        let assignments = JSON.parse(localStorage.getItem('myAssignments')) || [];
        assignments.splice(index, 1); // حذف العنصر المحدد
        localStorage.setItem('myAssignments', JSON.stringify(assignments)); // تحديث التخزين
        loadAssignments(); // إعادة تحميل القائمة
    }
}

// تحميل الأسساينمنتس أول ما الصفحة تفتح
loadAssignments();