import mongoose, { ObjectId, Schema, model } from "mongoose";

type Tquestion = {
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  answer: string;
  id: number;
  mark: number;
};

export interface IAssessment {
  courseId: ObjectId;
  questions: Tquestion[];
  minimumMark: number;
}

const assessmentSchema = new Schema<IAssessment>({
  courseId: { type: mongoose.Types.ObjectId, required: true },
  questions: [
    {
      question: { type: String, required: true },
      optionA: { type: String, required: true },
      optionB: { type: String, required: true },
      optionC: { type: String, required: true },
      optionD: { type: String, required: true },
      answer: { type: String, required: true },
      id: { type: Number, required: true },
      mark: { type: Number, required: true },
    },
  ],
  minimumMark: { type: Number, required: true },
});

const Assessment = model("Assessment", assessmentSchema);
export default Assessment;
