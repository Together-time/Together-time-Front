"use client";

import React, { useEffect, useState } from "react";
import { BiCalendar } from "react-icons/bi";
import styles from './projectList.module.css';
import Popup from './projectAddPopUp';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import { fetchProjects } from '@/app/store/projectSlice';

const ProjectList: React.FC = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const dispatch = useAppDispatch();

  // Redux에서 프로젝트 데이터 가져오기
  const { projects, loading, error } = useAppSelector((state) => state.project);

  // 프로젝트 데이터 로드
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      console.log('JWT 토큰이 없습니다. fetchProjects를 호출하지 않습니다.');
      return;
    }
    // 프로젝트 데이터를 Redux 상태로 가져오기
    dispatch(fetchProjects())
      .unwrap()
      .then(() => {
        console.log('프로젝트 리스트 요청 성공');
      })
      .catch((err) => {
        console.error('프로젝트 리스트 요청 실패:', err);
      });
  }, [dispatch]);

  if (status === "loading") return <p>Loading...</p>;
  if (error) return <p>Error: {JSON.stringify(error)}</p>; // 객체를 문자열로 변환하여 출력

  return (
    <div className={styles.projectContainer}>
      {/* 현재 참여 중인 프로젝트 */}
      <div className={styles.projectIcon} title="현재 참여중인 시간표">
        <BiCalendar />
      </div>

      {loading && <p>로딩 중...</p>}
      {error && <p>에러: {error}</p>}
      {!loading && !error && projects.map((project) => (
        <div
          key={project.id}
          className={`${styles.projectCircle} ${
            selectedProjectId === project.id ? styles.selectedProjectActive : ""
          }`}
          onClick={() => setSelectedProjectId(project.id)}
        >
          {project.title?.charAt(0).toUpperCase() || "?"}
        </div>
      ))}

      {/* 새로운 프로젝트 추가 */}
      <div
        className={`${styles.addCircle} ${styles.projectCircle}`}
        onClick={() => setIsPopupOpen(true)}
      >
        +
      </div>

      {/* 프로젝트 추가 팝업 */}
      {isPopupOpen && (
        <Popup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
      )}
    </div>
  );
};

export default ProjectList;
