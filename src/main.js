// Program data
const { id, name: courseName, course_id, group_weight, assignments } = AssignmentGroup

// populate HTML from data
const courseTitle = document.getElementById('course-name')
courseTitle.innerText = `${CourseInfo.name} (${CourseInfo.id})`

// populate assignment details table
const assignmentDetailsTable = document.getElementById('assignment-group-details-table')
const [detialsHead, detailsBody] = assignmentDetailsTable.children
detialsHead.innerHTML = `<th>Field</th><th>Value</th>`
detailsBody.innerHTML = Object.entries(AssignmentGroup)
  .slice(0, 4)
  .map(data => `<tr><td>${data[0]}</td><td>${data[1]}</td></tr>`)
  .join('')

// populate assignment table
const assignmentsTable = document.getElementById('assignment-group-table')
const [assignmentHead, assignementBody] = assignmentsTable.children
assignmentHead.innerHTML = `<th>Assignment ID</th>
<th>Name</th>
<th>Due Date</th>
<th>Points Possible</th>`
assignementBody.innerHTML = AssignmentGroup.assignments
  .map(data => `<tr>
  <td>${data.id}</td>
  <td>${data.name}</td>
  <td>${data.due_at}</td>
  <td>${data.points_possible}</td>
  </tr>`).join('')

// populate learner table
const learnerTable = document.getElementById('submissions-table')
const [learnerHead, learnerBody] = learnerTable.children
learnerHead.innerHTML = `<th>Learner ID</th>
<th>Assignment ID</th>
<th>Submission Date</th>
<th>Score</th>`
learnerBody.innerHTML = LearnerSubmissions
  .map(data => `<tr>
  <td>${data.learner_id}</td>
  <td>${data.assignment_id}</td>
  <td>${data.submission.submitted_at}</td>
  <td>${data.submission.score}</td>
  </tr>`).join('')



// populate assignment details table
const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions)
const resultsTable = document.getElementById('results')
resultsTable.innerText = JSON.stringify(result, null, 2)
console.log(result)






function getLearnerData(courseInfo, assignmentGroup, learnerSubmissions) {

  // if an AssignmentGroup does not belong to its course (mismatching course_id), 
  // your program should throw an error, letting the user know that the input was invalid. 
  try {
    validateCourse(courseInfo, assignmentGroup)
  }
  catch {
    window.alert('Mismatched course ID: AssignmentGroup does not belong to its course')
    return
  }

  const { assignments } = assignmentGroup
  const calculatedScores = learnerSubmissions.map(learner => {

    // find the the submission in assignments
    const assignment = assignments.find(obj => obj.id === learner.assignment_id)

    try {
      // calculate the final score
      let finalScore = calculateScore(learner.submission.score, assignment.points_possible)

      // if assignment is late, deduct 10 points
      if (isLateSubmission(assignment.due_at, learner.submission.submitted_at)) {
        finalScore -= 10
      }

      // add finalScore and points possible to learner
      learner.submission.finalScore = finalScore
      learner.submission.points_possible = assignment.points_possible

      // return learner
      const newObj = { ...learner, ...learner.submission }
      delete newObj.submission
      return newObj
    }
    catch {
      console.log(`submission points possible are zero, skipping assignment`, assignment)
    }

  })

  // remove undefined scores i.e assignements with zero points possible
  const filteredScores = calculatedScores.filter(obj => obj !== undefined)

  // group by leaner id
  const idGroup = Object.groupBy(filteredScores, ({ learner_id }) => learner_id)


  // calculate the average grade
  for (const learner in idGroup) {
    let num = 0
    let denom = 0
    idGroup[learner].forEach(element => {
      num += element.score
      denom += element.points_possible
    });
    idGroup[learner].avg = (num / denom * 100).toFixed(2)
  }

  // restructure data
  let result = []
  for (const learner in idGroup) {
    let newObj = {}
    idGroup[learner].forEach(element => {
      newObj.id = element.learner_id
      newObj[element.assignment_id] = element.finalScore
      newObj.avg = idGroup[learner].avg
    });
    result.push(newObj)
  }

  return result
}



///////////////////////// HELPER FUNCTIONS /////////////////////////  
function validateCourse(courseInfo, assignmentGroup) {
  if (courseInfo.id !== assignmentGroup.course_id)
    throw ("Mismatched course ID: Assignment group does not belong to this course.")
}


function calculateScore(score, pointsPossible) {
  pointsPossible = parseFloat(pointsPossible)
  score = parseFloat(score)
  if (pointsPossible !== 0)
    return (score / pointsPossible * 100).toFixed(2)
  else
    throw Error("Division by Zero")
}


function isLateSubmission(dueDate, submissionDate) {
  dueDate = new Date(dueDate)
  submissionDate = new Date(submissionDate)
  return dueDate.getTime() < submissionDate.getTime()
}

