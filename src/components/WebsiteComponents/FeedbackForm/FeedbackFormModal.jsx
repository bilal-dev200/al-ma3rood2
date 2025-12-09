"use client";

import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Button from "@/components/WebsiteComponents/ReuseableComponenets/Button";
import { userApi } from "@/lib/api/user";

export default function FeedbackFormModal({ isOpen, onClose }) {
  const [formResponse, setFormResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState({});
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  // Get the appropriate form based on language
  const formData = formResponse
    ? isArabic
      ? formResponse.form_ar || formResponse.form_en
      : formResponse.form_en || formResponse.form_ar
    : null;

  useEffect(() => {
    if (isOpen && !formResponse) {
      fetchFormData();
    }
  }, [isOpen]);

  // Re-initialize answers when language changes (using already fetched data)
  useEffect(() => {
    if (formResponse) {
      const currentForm = isArabic
        ? formResponse.form_ar || formResponse.form_en
        : formResponse.form_en || formResponse.form_ar;
      
      if (currentForm) {
        const initialAnswers = {};
        currentForm.questions?.forEach((question) => {
          initialAnswers[question.id] = "";
        });
        setAnswers(initialAnswers);
      }
    }
  }, [isArabic, formResponse]);

  const fetchFormData = async () => {
    setLoading(true);
    try {
      const response = await userApi.getFeedbackForm();
      setFormResponse(response);
      
      // Get the appropriate form based on current language
      const currentForm = isArabic
        ? response.form_ar || response.form_en
        : response.form_en || response.form_ar;
      
      // Initialize answers object
      const initialAnswers = {};
      currentForm?.questions?.forEach((question) => {
        initialAnswers[question.id] = "";
      });
      setAnswers(initialAnswers);
    } catch (error) {
      toast.error(t("Failed to load feedback form. Please try again."));
      console.error("Error fetching feedback form:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => {
      const newAnswers = {
        ...prev,
        [questionId]: value,
      };

      // Clear answers for conditional questions if parent condition is no longer met
      if (formData) {
        formData.questions?.forEach((question) => {
          if (question.is_conditional && question.parent_question_id?.toString() === questionId?.toString()) {
            const parentQuestion = formData.questions.find(
              (q) => q.id?.toString() === question.parent_question_id?.toString()
            );
            if (parentQuestion) {
              const parentOption = parentQuestion.options?.find(
                (opt) => opt.id === question.parent_option_id
              );
              if (parentOption && value !== parentOption.value) {
                // Clear the conditional question's answer if condition is not met
                newAnswers[question.id] = "";
              }
            }
          }
        });
      }

      return newAnswers;
    });
  };

  const shouldShowQuestion = (question) => {
    // Explicitly check if question is conditional
    const isConditional = question.is_conditional === true || question.is_conditional === 1;
    
    // Show non-conditional questions
    if (!isConditional) {
      return true;
    }

    // For conditional questions, check if parent condition is met
    if (!formData || !question.parent_question_id) {
      return false;
    }

    const parentQuestion = formData.questions.find(
      (q) => q.id?.toString() === question.parent_question_id?.toString()
    );

    if (!parentQuestion) {
      return false;
    }

    // Get parent answer - try both number and string keys
    const parentQuestionId = question.parent_question_id;
    const parentAnswer = answers[parentQuestionId] || 
                        answers[parentQuestionId?.toString()] ||
                        answers[String(parentQuestionId)];
    
    // If no answer yet, don't show conditional question
    if (!parentAnswer || parentAnswer === "" || parentAnswer === null || parentAnswer === undefined) {
      return false;
    }

    // Find the parent option that triggers this conditional question
    const parentOption = parentQuestion.options?.find(
      (opt) => opt.id === question.parent_option_id
    );

    if (!parentOption) {
      return false;
    }

    // Show if parent answer matches the required option value (case-insensitive comparison)
    const parentAnswerNormalized = String(parentAnswer).trim().toLowerCase();
    const optionValueNormalized = String(parentOption.value).trim().toLowerCase();
    const shouldShow = parentAnswerNormalized === optionValueNormalized;
    
    return shouldShow;
  };

  const validateForm = () => {
    if (!formData) return false;

    for (const question of formData.questions) {
      // Only validate questions that are visible (not hidden conditional questions)
      if (shouldShowQuestion(question)) {
        if ((question.required === 1 || question.required === true) && !answers[question.id]) {
          toast.error(t("Please answer all required questions."));
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      // Prepare answers array matching the expected payload structure
      const answersArray = [];

      formData.questions?.forEach((question) => {
        // Only include visible questions
        if (!shouldShowQuestion(question)) {
          return;
        }

        const answer = answers[question.id];
        if (!answer || answer === "") {
          return;
        }

        // For questions with options (emoji, radio), use option_id
        if (question.type === "emoji" || question.type === "radio") {
          // Find the selected option by matching the answer value
          const selectedOption = question.options?.find(
            (opt) => opt.value === answer || String(opt.value).toLowerCase() === String(answer).toLowerCase()
          );
          
          if (selectedOption) {
            answersArray.push({
              question_id: question.id,
              option_id: selectedOption.id,
            });
          }
        } 
        // For text questions, use answer_text
        else if (question.type === "text") {
          answersArray.push({
            question_id: question.id,
            answer_text: answer,
          });
        }
      });

      // Prepare payload matching the expected structure
      const payload = {
        form_id: formData.form_id,
        answers: answersArray,
      };

      await userApi.addImprovementFeedback(payload);
      
      toast.success(t("Thank you for your feedback!"));
      handleClose();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      
      // Handle API validation errors
      const validationErrors = error?.data?.data || error?.response?.data?.data;
      if (validationErrors && typeof validationErrors === "object") {
        Object.entries(validationErrors).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            messages.forEach((msg) => {
              toast.error(msg);
            });
          } else {
            toast.error(messages);
          }
        });
      } else {
        // Fallback to general error message
        const errorMessage =
          error?.data?.message ||
          error?.response?.data?.message ||
          error?.message ||
          t("Failed to submit feedback. Please try again.");
        toast.error(errorMessage);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setAnswers({});
    setFormResponse(null);
    onClose();
  };

  const renderQuestion = (question) => {
    const answer = answers[question.id] || "";

    switch (question.type) {
      case "emoji":
        return (
          <div className="space-y-3">
            <div 
              className={`flex flex-wrap gap-3 ${isArabic ? "flex-row-reverse justify-start" : "justify-start"}`}
              dir={isArabic ? "rtl" : "ltr"}
            >
              {question.options?.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleAnswerChange(question.id, option.value)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                    answer === option.value
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-green-300 bg-white"
                  }`}
                  dir={isArabic ? "rtl" : "ltr"}
                >
                  <span className="text-3xl">{option.emoji}</span>
                  <span className={`text-sm font-medium text-gray-700 ${isArabic ? "text-right" : "text-left"}`}>{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case "radio":
        return (
          <div className="space-y-2" dir={isArabic ? "rtl" : "ltr"}>
            {question.options?.map((option) => (
              <label
                key={option.id}
                className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  answer === option.value
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-green-300 bg-white"
                } ${isArabic ? "flex-row-reverse gap-3" : "gap-3"}`}
                dir={isArabic ? "rtl" : "ltr"}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option.value}
                  checked={answer === option.value}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  className="w-4 h-4 text-green-500 focus:ring-green-500 flex-shrink-0"
                />
                <span className={`text-sm font-medium text-gray-700 flex-1 ${isArabic ? "text-right" : "text-left"}`}>{option.label}</span>
              </label>
            ))}
          </div>
        );

      case "text":
        return (
          <textarea
            value={answer}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            rows={4}
            dir={isArabic ? "rtl" : "ltr"}
            className={`w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-800 resize-none ${isArabic ? "text-right" : "text-left"}`}
            placeholder={t("Type your answer here...")}
          />
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div 
        dir={isArabic ? "rtl" : "ltr"}
        className={`bg-white rounded-xl w-full max-w-2xl max-h-[90vh] shadow-2xl relative transition-all flex flex-col ${isArabic ? "text-right" : "text-left"}`}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className={`absolute top-4 ${isArabic ? "left-4" : "right-4"} text-gray-400 hover:text-gray-600 z-10`}
          aria-label={t("Close")}
        >
          <FaTimes size={20} />
        </button>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto custom-scroll flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            </div>
          ) : formData ? (
            <>
              {/* Form Title */}
              <h2 className={`text-2xl font-semibold mb-2 text-gray-800 ${isArabic ? "text-right" : "text-left"}`}>
                {formData.title}
              </h2>
              {formData.description && (
                <p className={`text-sm text-gray-600 mb-6 ${isArabic ? "text-right" : "text-left"}`}>{formData.description}</p>
              )}

              {/* Questions */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {formData.questions?.map((question, index) => {
                  // Only render question if it should be shown
                  const shouldShow = shouldShowQuestion(question);
                  if (!shouldShow) {
                    return null;
                  }

                  return (
                    <div key={question.id} className="space-y-3">
                      <label className={`block text-sm font-semibold text-gray-800 ${isArabic ? "text-right" : "text-left"}`}>
                        {question.text}
                        {question.required === 1 && (
                          <span className={`text-red-500 ${isArabic ? "mr-1" : "ml-1"}`}>*</span>
                        )}
                      </label>
                      {renderQuestion(question)}
                    </div>
                  );
                })}

                {/* Action Buttons */}
                <div className={`flex gap-3 pt-4 ${isArabic ? "flex-row-reverse justify-start" : "justify-end"}`}>
                  <Button
                    title={t("Cancel")}
                    onClick={handleClose}
                    className="text-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
                    disabled={submitting}
                  />
                  <Button
                    title={submitting ? t("Submitting...") : t("Submit")}
                    type="submit"
                    className="text-sm"
                    disabled={submitting}
                  />
                </div>
              </form>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">{t("Failed to load form")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

