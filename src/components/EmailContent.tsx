"use client";
import { useEffect, useState } from "react";

interface Email {
    id: number;
    sender: string;
    senderFull: string;
    subject: string;
    subjectFull: string;
    preview: string;
    previewFull: string;
    date: string;
    isUnread: boolean;
    body: string;
    isHtml: boolean;
}

const EmailContent: React.FC<{ email: Email }> = ({ email }) => {
    const [sanitizedHtml, setSanitizedHtml] = useState("");

    useEffect(() => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(email.body, "text/html");

        // Remove potentially dangerous elements
        doc.querySelectorAll("script, iframe, embed, object").forEach(el => el.remove());

        // Remove event handlers
        doc.querySelectorAll("*").forEach(el => {
            [...el.attributes].forEach(attr => {
                if (attr.name.startsWith("on")) {
                    el.removeAttribute(attr.name);
                }
            });
        });

        // Extract and process styles
        const styles = doc.querySelectorAll("style");
        let extractedCSS = `
            .email-content-container {
                max-width: 100%;
                overflow-x: hidden;
                word-wrap: break-word;
                font-family: Arial, sans-serif;
                position: relative;
            }
            .email-content-container img,
            .email-content-container button,
            .email-content-container input,
            .email-content-container iframe,
            .email-content-container table,
            .email-content-container div {
                max-width: 100% !important;
                height: auto !important;
                box-sizing: border-box !important;
                margin-left: 0 !important;
                margin-right: 0 !important;
            }
            .email-content-container table {
                width: 100% !important;
                display: block;
                overflow-x: auto;
            }
            .email-content-container td,
            .email-content-container th {
                max-width: none !important;
                white-space: normal !important;
                word-break: break-word;
            }
            .email-content-container pre {
                white-space: pre-wrap;
                word-wrap: break-word;
                max-width: 100%;
                overflow-x: auto;
                background: #f5f5f5;
                padding: 10px;
                border-radius: 4px;
            }
            .email-content-container a {
                word-break: break-all;
            }
            .email-content-container * {
                max-width: 100%;
            }
            @media screen and (max-width: 600px) {
                .email-content-container table {
                    font-size: 14px;
                }
                .email-content-container img {
                    height: auto !important;
                }
            }
        `;

        styles.forEach(style => {
            extractedCSS += style.innerHTML;
        });

        // Clean up existing styles
        const existingStyle = document.getElementById("email-custom-styles");
        if (existingStyle) {
            existingStyle.remove();
        }

        // Add new styles
        const styleElement = document.createElement("style");
        styleElement.id = "email-custom-styles";
        styleElement.textContent = extractedCSS;
        document.head.appendChild(styleElement);

        // Wrap content in container
        const wrappedContent = `<div class="email-content-container">${doc.body.innerHTML}</div>`;
        setSanitizedHtml(wrappedContent);

        return () => {
            const styleToRemove = document.getElementById("email-custom-styles");
            if (styleToRemove) {
                styleToRemove.remove();
            }
        };
    }, [email.body]);

    return (
        <div className="relative w-full">
            <div 
                className="email-wrapper overflow-hidden rounded-lg bg-white"
                style={{
                    maxWidth: '100%',
                    margin: '0 auto',
                    position: 'relative',
                    boxSizing: 'border-box'
                }}
            >
                <div 
                    className="email-scroll-container overflow-y-auto max-h-[70vh] p-6"
                    style={{
                        overflowX: 'hidden',
                        overflowY: 'auto',
                        WebkitOverflowScrolling: 'touch',
                        width: '100%',
                        boxSizing: 'border-box'
                    }}
                    dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
                />
            </div>
        </div>
    );
};

export default EmailContent;
