import { NextFunction, Request, RequestHandler, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Assessment, { IAssessment } from "../model/AssessmentModel";

// create assessment

export const createAssessment = expressAsyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const { courseId, minimumMark, questions } = req.body;
    const creatAssessment = await Assessment.findOneAndUpdate(
      {
        courseId: courseId,
      },
      {
        minimumMark: parseInt(minimumMark, 10),
        questions: questions,
      },
      {
        new: true,
        upsert: true,
      }
    );

    if (creatAssessment) {
      res.status(200).json({
        success: true,
        message: "assessment created Successfully",
        assessment: creatAssessment,
      });
    } else {
      res.status(500);
      next(Error("Internal Server Error!"));
    }

})

// get assessment

export const getAssessment = expressAsyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const courseId = req.params.id;
    const assessment = await Assessment.findOne(
      { courseId: courseId },
    );
    if (assessment) {
      res.status(200).json({
        success: true,
        assessment,
      });
    } else {
      res.status(500);
      next(Error("Internal Server Error"));
    }
})

// verify assessment

export const checkAssessment: RequestHandler = expressAsyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const { assessmentId, studentAnswers } = req.body;
    const assessment: IAssessment | null = await Assessment.findOne({
      _id: assessmentId,
    });
    if (!assessment) {
      res.status(404);
      next(Error("No Assessment found!"));
    }

    let obtainedScore: number = 0;
    assessment?.questions.forEach((question) => {
      const studentAnswer = studentAnswers.find(
        (answer: { id: number; answer: string }) => answer.id === question.id
      );
      if (!studentAnswer) {
        return;
      }
      if (studentAnswer.answer === question.answer) {
        obtainedScore += question.mark;
      }
    });

    const totalScore = assessment?.questions.reduce(
      (total, question) => total + question.mark,
      0
    );
    if (totalScore && assessment?.minimumMark) {
      const percentage = (obtainedScore / totalScore) * 100;
      if (percentage >= assessment.minimumMark) {
        res.status(200).json({
          success: true,
          obtainedScore,
          totalScore,
          percentage,
          minimumMark: assessment.minimumMark,
        });
      } else {
        res.json({
          success: false,
          obtainedScore,
          totalScore,
          percentage,
          minimumMark: assessment.minimumMark,
        });
      }
    }
})