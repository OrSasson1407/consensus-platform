import { Request, Response } from 'express';
import crypto from 'crypto';

export const handleCreateRoom = async (req: Request, res: Response) => {
  try {
    const { category_type } = req.body;
    const roomId = crypto.randomUUID();
    // TODO: Insert into PostgreSQL rooms table
    res.status(201).json({ room_id: roomId, category_type, message: "Room created successfully" });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create room' });
  }
};

export const handleJoinRoom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // @ts-ignore
    const userId = req.user?.id || 'mock_user_id';
    // TODO: Insert into PostgreSQL room_members table
    res.status(200).json({ room_id: id, user_id: userId, message: "Joined room successfully" });
  } catch (error) {
    res.status(500).json({ error: 'Failed to join room' });
  }
};

export const handleGetRoom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    res.status(200).json({ room_id: id, status: "active" });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch room' });
  }
};

export const handleGetContent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // TODO: Fetch content_items assigned to this room_id from DB
    res.status(200).json({ items: [{ id: "item_1", title: "Sample Content 1" }] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch room content' });
  }
};

export const handleGetMembers = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // TODO: Fetch from room_members joined with users
    res.status(200).json({ members: [] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch room members' });
  }
};

export const handleSwipe = async (req: Request, res: Response) => {
  try {
    // Fallback REST endpoint if WebSocket isn't used for a specific action
    res.status(200).json({ message: "Swipe recorded via REST" });
  } catch (error) {
    res.status(500).json({ error: 'Failed to record swipe' });
  }
};
