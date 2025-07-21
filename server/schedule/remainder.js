import cron from 'node-cron';
import User from '../models/userModel.js';
import sendMail from '../Mailer/mailer.js';



cron.schedule('* * * * *', async () => {
  console.log('Running daily pending tasks email job:', new Date().toLocaleString());

  try {
 
    const users = await User.find({ role: 'staff' }).populate('pendingTask');

    for (const user of users) {
      if (!user.pendingTask.length) {
        console.log(`User ${user.email} has no pending tasks. Skipping email.`);
        continue;
      }
      
      const tasks = user.pendingTask.map(task => ({
        title: task.taskName,
        description: task.taskDescription,
        deadline: task.dueDate.toDateString(),
      }));

      await sendMail({
        to: user.email,
        subject: 'Your Pending Tasks Summary',
        templateName: 'pending-tasks-summary',
        replacements: {
          user: user.name,   
          tasks,            
        },
      });
      console.log(`Pending tasks email sent to ${user.email}`);
    }
  } catch (err) {
    console.error('Error running daily pending tasks job:', err);
  }
});
