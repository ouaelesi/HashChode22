// this is the code source of the hashCode22

const fs = require("fs");
// Listofconstributers
let contributersList = [];

// list of projects
let projectsList = [];

fs.readFile("b_better_start_small.in.txt", "utf8", (err, data) => {
  if (err) throw err;

  /* read line by line*/
  const lines = data.split(/\r?\n/);

  // the first line
  const firstLine = lines[0];

  // number of projects
  const numProjects = firstLine.split(" ")[1];
  const numContributers = firstLine.split(" ")[0];

  let currentLine = 1;
  //making the list of contributers
  for (let i = 0; i < numContributers; i++) {
    const contributer = lines[currentLine];
    let name = contributer.split(" ")[0];
    let numSkills = contributer.split(" ")[1];
    currentLine += 1;

    //adding the skills
    const skills = [];
    for (let j = 0; j < numSkills; j++) {
      const skill = lines[currentLine].split(" ")[0];
      const skillLevel = lines[currentLine].split(" ")[1];

      skills.push({
        skill,
        skillLevel: Number(skillLevel),
      });
      currentLine += 1;
     
    }
    contributersList.push({
      name,
      skills,
    });
  }

  // Making the Projects list

  for (let i = 0; i < numProjects; i++) {
    const projectLine = lines[currentLine].split(" ");

    const prjNumCont = projectLine[4]; // number of contributers in the project
    currentLine += 1;

    // making the skills needed for the project
    let prjSkills = [];
    for (j = 0; j < prjNumCont; j++) {
      const skillLine = lines[currentLine].split(" ");
      prjSkills.push({
        skill: skillLine[0],
        skillLevel: Number(skillLine[1]),
      });
      currentLine += 1;
    }

    // add the project the list
    projectsList.push({
      projectName: projectLine[0],
      duration: projectLine[1],
      points: projectLine[2],
      bestBefore: projectLine[3],
      prjSkills,
    });
    
  }


  // HERE THE MAGIC STARTS

  // sorting the projects by bestBefore
  projectsList.sort(function (a, b) {
    return a.bestBefore - b.bestBefore;
  });

  fs.appendFileSync("b_result.txt", numProjects, (err) => {
    if (err) {
      console.log(err);
    }
  });

  while (projectsList.length != 0) {
    console.log(projectsList.length)
    //mapping the projects
    //console.log("************************************" ,projectsList)
    projectsList.map((project, key) => {
      const currentProject = key;
      // console.log('\n \n \n----------------- project', project)
      let affecteddev = [];
      // mapping the projects skills
      project.prjSkills.map((skill, key2) => {
      //  console.log('skill' , skill) ;
        // mapping the contributers
        let find = false ; 
        let key3 =0 ; 
        while (!find && key3<contributersList.length){
              //   console.log('contributer' , contributer) ;
          // mapping the contributer skills
          let skillNedded = contributersList[key3].skills.find(e=> e.skill === skill.skill)
          
          // console.log('//////////////' , contributer.name ,' ', skill.skill , ' ' , skillNedded)
           //if (skillNedded) console.log("skillNedded" , skillNedded.skillLevel , ' ' , skill.skillLevel)
           if (skillNedded && (skillNedded.skillLevel >= skill.skillLevel || (skillNedded.skillLevel + 1)  === skill.skillLevel ) && !affecteddev.find(e=>e.coder === key3)){
               affecteddev.push({
               coder: key3,
               skl: contributersList[key3].skills.indexOf(skillNedded),
               add: skillNedded.skillLevel === skill.skillLevel || ((skillNedded.skillLevel + 1)  === skill.skillLevel) ,
             });
            find = true ; 
          }
             key3 += 1; 
        }
      });
     //console.log(project.projectName, "\n\n======> ", affecteddev);
      //console.log(affecteddev.length ,' ' , project.prjSkills.length)
      if (affecteddev.length >= project.prjSkills.length) {
        // writing the project name
        fs.appendFileSync(
          "b_result.txt",
          "\n" + project.projectName + "\n",
          (err) => {
            if (err) {
              console.log(err);
            }
          }
        );

        affecteddev.map((af, key) => {
            console.log(contributersList[af.coder].name + ' ')
          fs.appendFileSync(
            "b_result.txt",
            contributersList[af.coder].name + ' ',
            (err) => {
              if (err) {
                console.log(err);
              }
            }
          );
          if (af.add) {
            contributersList[af.coder].skills[af.skl].skillLevel += 1;
          }
        });
        projectsList.splice(currentProject, 1);
        console.log("projects removed " , currentProject)
      }else{
          //console.log("no"); 
      }
    });
  }
});
