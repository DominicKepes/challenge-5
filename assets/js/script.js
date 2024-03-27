document.addEventListener('DOMContentLoaded', function () {
  const timeBlocksContainer = document.getElementById('timeBlocks');
  const currentDayElement = document.getElementById('currentDay');

  function saveTask(time, task) {
    localStorage.setItem(time, task);
    showNotification();
  }

  function showNotification() {
    const notification = document.getElementById('notify');
    notification.classList.add('show');
    setTimeout(function () {
      notification.classList.remove('show');
    }, 5000);
  }

  function hourUpdater() {
    const currentHour = dayjs().hour();
    const timeBlockElements = document.querySelectorAll('.time-block');

    timeBlockElements.forEach(function (block) {
      const blockHour = parseInt(block.id.split('-')[1]);

      if (blockHour < currentHour) {
        block.classList.add('past');
      } else if (blockHour === currentHour) {
        block.classList.remove('past');
        block.classList.add('present');
      } else {
        block.classList.remove('past', 'present');
        block.classList.add('future');
      }
    });
  }

  function loadTasks() {
    for (let i = 9; i <= 17; i++) {
      const time = `hour-${i}`;
      const timeBlock = document.getElementById(time);
      if (timeBlock) {
        const descriptionElement = timeBlock.querySelector('.description');
        if (descriptionElement) {
          const savedTask = localStorage.getItem(time);
          if (savedTask) {
            descriptionElement.value = savedTask;
          }
        } else {
          console.error(`Description element not found for time block ${time}`);
        }
      } else {
        console.error(`Time block not found for hour ${i}`);
      }
    }
  }

  function createTimeBlock(hour) {
    const timeBlock = document.createElement('div');
    timeBlock.classList.add('row', 'time-block');
    timeBlock.id = `hour-${hour}`;

    timeBlock.innerHTML = `
      <div class="col-2 col-md-1 hour text-center py-3">${hour > 12 ? hour - 12 + 'PM' : hour + 'AM'}</div>
      <textarea class="col-8 col-md-10 description" rows="3"></textarea>
      <button class="btn saveBtn col-2 col-md-1" aria-label="save">
        <i class="fas fa-save" aria-hidden="true"></i>
      </button>
    `;

    const saveBtn = timeBlock.querySelector('.saveBtn');
    const description = timeBlock.querySelector('.description');

    saveBtn.addEventListener('click', function () {
      saveTask(timeBlock.id, description.value);
    });

    return timeBlock;
  }

  function init() {
    for (let i = 9; i <= 24; i++) {
      timeBlocksContainer.appendChild(createTimeBlock(i));
    }

    loadTasks();
    hourUpdater();
    setInterval(hourUpdater, 15000);
    currentDayElement.textContent = dayjs().format('dddd, MMMM D, YYYY');

  }

  init();
});
