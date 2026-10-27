"use client";

import { useActionState, useEffect, useRef } from "react";
import { addDeadlineAction } from "@/lib/actions";
import type { Subject } from "@/types";
import {
  PlusOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

export default function AddDeadlineForm({ subjects }: { subjects: Subject[] }) {
  const [state, formAction, isPending] = useActionState(addDeadlineAction, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state?.success]);

  return (
    <form ref={formRef} action={formAction}>
      {state?.error && (
        <div className="alert alert-error" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <ExclamationCircleOutlined />
          <span>{state.error}</span>
        </div>
      )}
      {state?.success && (
        <div className="alert alert-success" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <CheckCircleOutlined />
          <span>Thêm deadline thành công! Dữ liệu đã được cập nhật.</span>
        </div>
      )}

      <div className="form-group">
        <label className="form-label" htmlFor="title">
          Tiêu đề deadline *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          placeholder="Ví dụ: Bài tập lớn cuối kỳ"
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="subjectId">
          Môn học *
        </label>
        <select id="subjectId" name="subjectId" required className="form-control">
          <option value="">-- Chọn môn học --</option>
          {subjects.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.code} - {sub.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid-2">
        <div className="form-group">
          <label className="form-label" htmlFor="type">
            Loại hình *
          </label>
          <select id="type" name="type" required className="form-control">
            <option value="assignment">Bài tập</option>
            <option value="lab">Lab thực hành</option>
            <option value="project">Bài tập lớn</option>
            <option value="exam">Kiểm tra / Thi</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="priority">
            Mức độ ưu tiên *
          </label>
          <select id="priority" name="priority" required className="form-control" defaultValue="medium">
            <option value="low">Thấp</option>
            <option value="medium">Trung bình</option>
            <option value="high">Cao</option>
            <option value="urgent">Khẩn cấp</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="dueDate">
          Thời hạn nộp *
        </label>
        <input
          id="dueDate"
          name="dueDate"
          type="datetime-local"
          required
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="description">
          Mô tả chi tiết và yêu cầu nộp *
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          required
          placeholder="Mô tả cụ thể yêu cầu của giảng viên, định dạng file nộp, nơi nộp..."
          className="form-control"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="btn btn-primary"
        style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
      >
        {isPending ? (
          <>
            <LoadingOutlined />
            <span>Đang thêm...</span>
          </>
        ) : (
          <>
            <PlusOutlined />
            <span>Thêm Deadline</span>
          </>
        )}
      </button>
    </form>
  );
}
