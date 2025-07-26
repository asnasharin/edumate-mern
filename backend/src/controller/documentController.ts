import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Document from "../model/DocumentModel";


// upload document
export const uploadDoc = expressAsyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id
    const { image, name } = req.body
    const uploadDoc = await Document.create({
        name: name,
        document: image,
        userID: userId
    })
    if (uploadDoc) {
      res.status(200).json({
        success: true,
        message: "Document Uploaded Successfully!",
      });
    } else {
      next(Error("Error uploading the Document"));
    }
})


// get document

export const getMyDocuments = expressAsyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id
    const document = await Document.find({ userID: userId})
    res.status(200).json({
        success: true,
        document: document
    })
})


// delete document

export const deleteDocument = expressAsyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const { id } = req.body
    await Document.findByIdAndDelete({ _id: id})
    res.status(200)
    res.json({
        success: true
    })
})

