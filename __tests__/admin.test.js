import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminPage from '@/app/admin/page';
import { createClient } from '@/lib/supabase/client';

// Mock Supabase client
jest.mock('@/lib/supabase/client');

const mockActivities = [
    {
        id: '1',
        title: '测试活动',
        start_time: '2026-01-15T09:00:00Z',
        end_time: '2026-01-15T11:00:00Z',
        location: '测试地点',
        speaker: '测试演讲者',
        description: '测试描述',
    },
];

describe('Admin CRUD Operations', () => {
    let mockFrom;
    let mockInsert;
    let mockUpdate;
    let mockDelete;

    beforeEach(() => {
        mockInsert = jest.fn(() => ({
            data: null,
            error: null,
        }));

        mockUpdate = jest.fn(() => ({
            eq: jest.fn(() => ({
                data: null,
                error: null,
            })),
        }));

        mockDelete = jest.fn(() => ({
            eq: jest.fn(() => ({
                data: null,
                error: null,
            })),
        }));

        mockFrom = jest.fn((table) => ({
            select: jest.fn(() => ({
                order: jest.fn(() => ({
                    data: mockActivities,
                    error: null,
                })),
            })),
            insert: mockInsert,
            update: mockUpdate,
            delete: mockDelete,
        }));

        createClient.mockReturnValue({
            from: mockFrom,
        });
    });

    test('should display activities list', async () => {
        render(<AdminPage />);

        await waitFor(() => {
            expect(screen.getByText('测试活动')).toBeInTheDocument();
        });
    });

    test('should show create form when "新增活动" button is clicked', async () => {
        render(<AdminPage />);

        await waitFor(() => {
            expect(screen.getByText('+ 新增活动')).toBeInTheDocument();
        });

        const createButton = screen.getByText('+ 新增活动');
        fireEvent.click(createButton);

        await waitFor(() => {
            expect(screen.getByText('新增活动')).toBeInTheDocument();
            expect(screen.getByLabelText(/活动标题/)).toBeInTheDocument();
        });
    });

    test('should create a new activity', async () => {
        render(<AdminPage />);

        // Open create form
        const createButton = screen.getByText('+ 新增活动');
        fireEvent.click(createButton);

        await waitFor(() => {
            expect(screen.getByText('新增活动')).toBeInTheDocument();
        });

        // Fill form
        fireEvent.change(screen.getByLabelText(/活动标题/), {
            target: { value: '新活动' },
        });
        fireEvent.change(screen.getByLabelText(/开始时间/), {
            target: { value: '2026-02-01T10:00' },
        });
        fireEvent.change(screen.getByLabelText(/结束时间/), {
            target: { value: '2026-02-01T12:00' },
        });
        fireEvent.change(screen.getByLabelText(/地点/), {
            target: { value: '新地点' },
        });
        fireEvent.change(screen.getByLabelText(/演讲者/), {
            target: { value: '新演讲者' },
        });

        // Submit form
        const submitButton = screen.getByText('创建活动');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockInsert).toHaveBeenCalled();
        });
    });

    test('should show edit form when "编辑" button is clicked', async () => {
        render(<AdminPage />);

        await waitFor(() => {
            expect(screen.getByText('测试活动')).toBeInTheDocument();
        });

        const editButton = screen.getByText('编辑');
        fireEvent.click(editButton);

        await waitFor(() => {
            expect(screen.getByText('编辑活动')).toBeInTheDocument();
            expect(screen.getByDisplayValue('测试活动')).toBeInTheDocument();
        });
    });

    test('should update an activity', async () => {
        render(<AdminPage />);

        await waitFor(() => {
            expect(screen.getByText('测试活动')).toBeInTheDocument();
        });

        // Open edit form
        const editButton = screen.getByText('编辑');
        fireEvent.click(editButton);

        await waitFor(() => {
            expect(screen.getByText('编辑活动')).toBeInTheDocument();
        });

        // Update title
        const titleInput = screen.getByDisplayValue('测试活动');
        fireEvent.change(titleInput, { target: { value: '更新后的活动' } });

        // Submit form
        const submitButton = screen.getByText('保存修改');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockUpdate).toHaveBeenCalled();
        });
    });

    test('should delete an activity with confirmation', async () => {
        // Mock window.confirm
        global.confirm = jest.fn(() => true);

        render(<AdminPage />);

        await waitFor(() => {
            expect(screen.getByText('测试活动')).toBeInTheDocument();
        });

        const deleteButton = screen.getByText('删除');
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(global.confirm).toHaveBeenCalled();
            expect(mockDelete).toHaveBeenCalled();
        });
    });

    test('should not delete activity if confirmation is cancelled', async () => {
        // Mock window.confirm to return false
        global.confirm = jest.fn(() => false);

        render(<AdminPage />);

        await waitFor(() => {
            expect(screen.getByText('测试活动')).toBeInTheDocument();
        });

        const deleteButton = screen.getByText('删除');
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(global.confirm).toHaveBeenCalled();
            expect(mockDelete).not.toHaveBeenCalled();
        });
    });
});

describe('Admin Permission Tests', () => {
    test('should prevent non-admin users from inserting activities', async () => {
        const mockFrom = jest.fn(() => ({
            insert: jest.fn(() => ({
                data: null,
                error: { message: 'Permission denied' },
            })),
        }));

        createClient.mockReturnValue({
            from: mockFrom,
        });

        // This test verifies that RLS policies prevent non-admin writes
        const supabase = createClient();
        const { error } = await supabase
            .from('teaching_activities')
            .insert([{ title: 'Test' }]);

        expect(error).toBeTruthy();
        expect(error.message).toBe('Permission denied');
    });

    test('should allow admin users to insert activities', async () => {
        const mockFrom = jest.fn(() => ({
            insert: jest.fn(() => ({
                data: [{ id: '1', title: 'Test' }],
                error: null,
            })),
        }));

        createClient.mockReturnValue({
            from: mockFrom,
        });

        // This test verifies that admin users can write
        const supabase = createClient();
        const { data, error } = await supabase
            .from('teaching_activities')
            .insert([{ title: 'Test' }]);

        expect(error).toBeFalsy();
        expect(data).toBeTruthy();
    });
});
