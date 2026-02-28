import { useEffect, useState } from 'react';
import GuestbookInput from './guestbookInput';
import '../styles/guestbook.css';

const COLUMN_COUNT = 5;

type GuestbookItem = {
  index: number;
  name: string;
  comment: string;
  date: string;
};

const GuestbookMasonry = () => {
  const [columns, setColumns] = useState<GuestbookItem[][]>(
    Array.from({ length: COLUMN_COUNT }, () => [])
  );

  useEffect(() => {
    // 열 구조: { height: number, items: [] }
    const cols = Array.from({ length: COLUMN_COUNT }, () => ({
      height: 0,
      items: [] as typeof GuestbookInput,
    }));

    GuestbookInput.forEach((item) => {
      // 가장 낮은 열 찾기
      const targetIndex = cols.reduce(
        (minIdx, col, idx) =>
          col.height < cols[minIdx].height ? idx : minIdx,
        0
      );

      // 아이템 추가
      cols[targetIndex].items.push(item);

      // 높이 증가 (실제 높이를 모르므로 1씩 증가)
      cols[targetIndex].height += 1;
    });

    setColumns(cols.map((c) => c.items));
  }, []);

  return (
    <div className="guestbook motionWrap">
      <div className="guestbookWrap">
        <div className="guestbookContainer">
          <div className="guestbookHeader">
            <h2>GUESTBOOK</h2>
            <p>Leave your comments and feedback below.</p>
          </div>

          <div className="masonry">
            {columns.map((col, colIndex) => (
              <div className="masonryColumn" key={colIndex}>
                {col.map((item) => (
                  <div className="masonryCard" key={item.index}>
                    <p>{item.comment}</p>
                    <span>{item.date}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="guestbookFooter"></div>
        </div>
      </div>
    </div>
  );
};

export default GuestbookMasonry;