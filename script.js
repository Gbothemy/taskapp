document.addEventListener('DOMContentLoaded', function() {
    // Task completion confirmation
    const completeTaskForms = document.querySelectorAll('.complete-task-form');
    completeTaskForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!confirm('Are you sure you want to complete this task?')) {
                e.preventDefault();
            }
        });
    });

    // Withdrawal amount validation
    const withdrawalForm = document.querySelector('#withdrawal-form');
    if (withdrawalForm) {
        withdrawalForm.addEventListener('submit', function(e) {
            const amount = parseInt(document.querySelector('#amount').value);
            const maxAmount = parseInt(document.querySelector('#amount').getAttribute('max'));
            if (amount > maxAmount) {
                e.preventDefault();
                alert('You cannot withdraw more than your available points.');
            }
        });
    }

    // Real-time search for tasks (on dashboard)
    const taskSearch = document.querySelector('#task-search');
    if (taskSearch) {
        taskSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const tasks = document.querySelectorAll('.task');
            tasks.forEach(task => {
                const taskTitle = task.querySelector('h4').textContent.toLowerCase();
                if (taskTitle.includes(searchTerm)) {
                    task.style.display = 'block';
                } else {
                    task.style.display = 'none';
                }
            });
        });
    }
});