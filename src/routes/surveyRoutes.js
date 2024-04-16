const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const express = require("express");
const z = require("zod");

const router = express.Router();

router.get("/", async(req,res) => {
    const surveys = await prisma.survey.findMany();

    res.json({
        survey: surveys.map(survey => ({
            id: survey.id,
            title: survey.title,
            description: survey.description
        }))
    })
});

const optionSchema = z.object({
    text: z.string()
});

const questionSchema = z.object({
    text: z.string(),
    options: z.array(optionSchema)
});

const surveySchema = z.object({
    title: z.string(),
    description: z.string(),
    questions: z.array(questionSchema)
});

router.post("/", async(req, res) => {
    const body = req.body;
    const success = surveySchema.safeParse(body);

    if(!success){
        return res.json({
            message: "Incorrect Inputs"
        })
    }

    const survey = await prisma.survey.create({
        data : {
            title: body.title,
            description: body.description,
        }
    })

    for(let i=0;i<body.questions.length;i++){
        const question = await prisma.question.create({
            data : {
                survey_id: survey.id,
                question_text: body.questions[i].text,
            }
        })
        for(let j=0;j<body.questions[i].options.length;j++){
            const option = await prisma.option.create({
                data : {
                    question_id: question.id,
                    option_text: body.questions[i].options[j].text
                }
            })
        }
    }

    return res.json({
        message: "Survey Created Successfuly"
    })

})

router.get("/:id", async(req, res) => {
    const id = req.params.id;

    const survey = await prisma.survey.findFirst({
        where: {
            id
        }
    })

    return res.json(survey);
})

router.delete("/:id", async(req, res) => {
    const id = req.params.id;

    const deleteSurvey = await prisma.survey.delete({
        where: {
            id
        }
    })

    return res.json({
        message : "Successfully Deleted"
    });
})


module.exports = router;