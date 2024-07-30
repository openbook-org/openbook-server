import { Request, Response } from "express";
import Group from "../../models/group/group";
import { ApiErrorClass, ErrorTypes } from "../../shared/apiErrorClass";
import { HttpStatusCode } from "../../shared/constant/httpStatusCodes";

interface CreateGroupBody {
  name: string;
  description?: string;
  members: string[];
}

export interface CreateGroupRequest extends Request {
  body: CreateGroupBody;
}

// Create a new group
export const createGroup = async (req: CreateGroupRequest, res: Response) => {
  const { name, description, members } = req.body;
  try {
    // ensure that the creator is a member of the group
    let ownerAdded = false;
    if (!members.includes(req.authenticatedUser._id.toString())) {
      members.push(req.authenticatedUser._id.toString());
      ownerAdded = true;
    }

    const group = new Group({
      name,
      description,
      members,
      createdBy: req.authenticatedUser._id,
    });

    await group.save();
    res.status(201).json({
      success: true,
      content: group,
      message: ownerAdded ? "Owner added to group" : undefined,
    });
  } catch (error) {
    return new ApiErrorClass(
      ErrorTypes.SERVICE_ERROR,
      "Service error",
      HttpStatusCode.SERVICE_ERROR
    );
  }
};

// Get a group by ID
export const getGroupById = async (req: Request, res: Response) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }
    res.status(200).json({
      success: true,
      content: group,
    });
  } catch (error) {
    return new ApiErrorClass(
      ErrorTypes.SERVICE_ERROR,
      "Service error",
      HttpStatusCode.SERVICE_ERROR
    );
  }
};

// Update a group by ID
export const updateGroup = async (req: Request, res: Response) => {
  try {
    const group = await Group.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!group) {
      return new ApiErrorClass(
        ErrorTypes.RESOURCE_NOT_FOUND,
        "Group not found",
        HttpStatusCode.NOT_FOUND
      );
    }
    res.status(200).json({
      success: true,
      content: group,
    });
  } catch (error) {
    return new ApiErrorClass(
      ErrorTypes.SERVICE_ERROR,
      "Service error",
      HttpStatusCode.SERVICE_ERROR
    );
  }
};

// Delete a group by ID
export const deleteGroup = async (req: Request, res: Response) => {
  try {
    const group = await Group.findByIdAndDelete(req.params.id);
    if (!group) {
      return new ApiErrorClass(
        ErrorTypes.RESOURCE_NOT_FOUND,
        "Group not found",
        HttpStatusCode.NOT_FOUND
      );
    }
    res.status(200).json({
      success: true,
      content: group,
    });
  } catch (error) {
    return new ApiErrorClass(
      ErrorTypes.SERVICE_ERROR,
      "Service error",
      HttpStatusCode.SERVICE_ERROR
    );
  }
};

// Add a member to a group
export const addMember = async (req: Request, res: Response) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return new ApiErrorClass(
        ErrorTypes.RESOURCE_NOT_FOUND,
        "Group not found",
        HttpStatusCode.NOT_FOUND
      );
    }
    group.members.push(req.body.memberId);
    await group.save();
    res.status(200).json(group);
  } catch (error) {
    return new ApiErrorClass(
      ErrorTypes.SERVICE_ERROR,
      "Service error",
      HttpStatusCode.SERVICE_ERROR
    );
  }
};

// Remove a member from a group
export const removeMember = async (req: Request, res: Response) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return new ApiErrorClass(
        ErrorTypes.RESOURCE_NOT_FOUND,
        "Group not found",
        HttpStatusCode.NOT_FOUND
      );
    }
    group.members = group.members.filter(
      (memberId) => memberId.toString() !== req.body.memberId
    );
    await group.save();
    res.status(200).json(group);
  } catch (error) {
    return new ApiErrorClass(
      ErrorTypes.SERVICE_ERROR,
      "Service error",
      HttpStatusCode.SERVICE_ERROR
    );
  }
};
