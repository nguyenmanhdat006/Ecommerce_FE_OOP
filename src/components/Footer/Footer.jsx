/* eslint-disable no-unused-vars */
import FbIcon from "../common/FbIcon";
import InstaIcon from "../common/InstaIcon";

const Footer = ({content}) => {
  const hasItems = content?.items && content.items.length > 0;
  const hasCopyright = content?.copyright;
  
  return (
    <div className='bg-black text-white py-8 mt-auto'>
      {hasItems && (
        <div className='flex justify-around mb-4'>
          {content.items.map((item, index) => {
            return (
              <div key={index} className='flex flex-col'>
                <p className='text-[16px] pb-[10px]'>{item?.title}</p>
                {item?.list && item.list.map((listItem, listIndex) => (
                  <a key={listIndex} className='flex flex-col text-[12px] py-2' href={listItem?.path}>
                    {listItem?.label}
                  </a>
                ))}
                {item?.description && <p>{item?.description}</p>}
              </div>
            );
          })}
        </div>
      )}
      <div className="flex gap-2 justify-center py-4">
        <a href="/fb"><FbIcon /></a>
        <a href="/insta"><InstaIcon /></a>
      </div>
      {hasCopyright && (
        <p className='text-sm text-white text-center content-center'>{content.copyright}</p>
      )}
    </div>
  )
}
export default Footer;